# Security Audit — buscarentrenador.com

**Scope:** all application source in `app/`, `service/`, `data/`, `db/`, `scripts/`, `migrations/`, plus root config (`next.config.mjs`, `tsconfig.json`, `package.json`, `.env*`).
**Date:** 2026-05-11 (refreshed 2026-05-13, re-audited 2026-06-12, updated 2026-06-13)
**Auditor:** Claude (static review, no runtime testing)

Severity uses CVSS-flavored buckets: **Critical / High / Medium / Low / Info**.

---

## Resolved findings

The following were eliminated by the Better Auth migration (branch `refactor/better-auth`):

- **H-2** — credentials login had no rate limiting. Better Auth's built-in `rateLimit` with `storage: "database"` and per-route rules (`/sign-in/email: { window: 15*60, max: 10 }`) replaces the old unthrottled NextAuth `authorize()` callback.
- **M-1** — password reset / email verification tokens stored in plaintext (`service/token_store.ts`). File deleted; Better Auth manages verification tokens internally via the `verifications` table.
- **M-2** — `getTrainerById` returned hidden profiles. Fixed: `service/trainers.ts:65` now filters `eq(trainers.is_visible, true)`.
- **M-3** — in-memory rate limiter (`service/ratelimit.ts`). File deleted; database-backed rate limiting via Better Auth.
- **M-4** — `x-forwarded-for` trusted in custom auth routes. All custom auth routes removed; Better Auth handles auth endpoints.
- **M-5** — verify-email token consumed on GET by the page itself. `app/verify-email/page.tsx` is now a passive result page; Better Auth's own `/api/auth/verify-email` endpoint handles the token.
- **M-8** — trainer emails served to unauthenticated visitors. `email` removed from `publicTrainerSelect()`; a separate `getTrainerEmail()` call is made only when a session exists, and threaded through the type system (`TrainerWithEmail`).
- **L-2** — non-constant-time token comparison. Resolved with M-1 (no custom token lookup).
- **L-3** — `session.update()` trusted client-supplied name/surname (`next-auth.config.ts`). File deleted with NextAuth removal.
- **L-7** — `forgot-password` custom route had no `AppError` mapping. Route deleted; Better Auth handles forgot-password natively.

Also resolved previously (2026-05-13):
- **C-1** — `password_hash` / `email_verified` leaked by trainer queries (hotfix `a72f78d`).
- **H-3** — resend-verification route lacked rate limiting and uniform responses.
- **H-4** — Google sign-in allowed unverified emails.

**Aggregate counts (2026-06-13): 0 Critical · 1 High · 2 Medium · 4 Low · 4 Info**

---

## HIGH

### H-1 — Sensitive secrets present in `.env.local` (rotate immediately)
**Severity:** High (operational hygiene; not a code defect)
**Files:** `.env.local`

The local environment file contains live secrets that have leaked into at least two audit/chat contexts and should be treated as compromised:
- `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` (Neon DB password `npg_WzyIo71OswhF`)
- `RESEND_API_KEY=re_8448eCZh_2eiP5KXCrcHrJK7yVGaSAihJ`
- `BETTER_AUTH_SECRET=CJLY6pFZrj+PsdWYpy7aT7In9gq3yX1EAW3eVX2S+No=`
- `AUTH_GOOGLE_SECRET` (if populated)

`.gitignore` correctly excludes `.env*.local` and the file was never committed — good. The risk is environmental: secrets appeared in shared chat sessions.

**Remediation:**
- Rotate the Neon DB password, `RESEND_API_KEY`, `BETTER_AUTH_SECRET` (`openssl rand -base64 32`), and Google OAuth client secret.
- Re-pull Vercel env with `vercel env pull`.
- Add a pre-commit hook (`gitleaks` or `trufflehog`) to catch accidental commits.

---

## MEDIUM

### M-6 — Trainer-creation endpoint has no length caps on free-text fields
**Severity:** Medium
**Files:** `app/api/auth/trainer/route.ts:9-18`

`trainerSchema` accepts `description: z.string().optional()` and `certifications: z.array(z.string()).optional()` with no length limits. An authenticated user can submit arbitrarily large payloads, bloating the DB row and any server-rendered page that displays them.

**Remediation:**
- `description: z.string().max(2000).optional()`
- `certifications: z.array(z.string().max(200)).max(20).optional()`
- Add a strict decimal validator for `hourly_rate` if/when it's wired up.

### M-7 — `ServerError` leaks server-side messages to clients
**Severity:** Medium
**Files:** `service/errors.ts`

```ts
export class ServerError extends AppError {
  constructor(message?: string) {
    const msg = message || "Server error";
    super(msg, 500, msg);  // clientMessage = server message
  }
}
```

`clientMessage` defaults to the same string as the internal message. Callers include `throw new ServerError(\`Missing required environment variable: ${key}\`)` and `throw new ServerError(\`Failed to send email: ${subject}\`)` — mild leaks today, but the pattern invites worse as the codebase grows.

**Remediation:** hard-code `clientMessage` to `"Error interno del servidor"` and keep the detailed message internal-only.

---

## LOW

### L-1 — Email-template interpolation does not HTML-escape `{{name}}`
**Severity:** Low
**Files:** `service/mailer.ts`, `service/templates/*.html`

```ts
const interpolate = (s: string) =>
  s.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');
```

`{{name}}` is dropped into HTML verbatim. For credential-signup names the server-side regex blocks `<`/`>`, but for Google sign-ins `splitGoogleName` accepts whatever Google sends. Self-XSS only, but defense in depth is cheap.

**Remediation:** HTML-escape `vars[key]` before substitution (replace `&`, `<`, `>`, `"`, `'`).

### L-4 — Numeric trainer ID parsing accepts `NaN`
**Severity:** Low
**Files:** `app/entrenadores/[id]/page.tsx:15`

`Number(id)` on a non-numeric segment yields `NaN`, which flows into `getTrainerById(NaN)`. Postgres rejects it as invalid and produces a 404 — benign today, but fragile.

**Remediation:** `z.coerce.number().int().positive().safeParse(id)` and `notFound()` on failure.

### L-5 — Public page redirects to `/login` on database errors
**Severity:** Low (UX/observability)
**Files:** `app/entrenadores/page.tsx:38-39`

Any DB failure on a public page forces the visitor to the login page, hiding the real error and generating confusing UX. No error is logged.

**Remediation:** render a graceful empty state and log the error server-side; don't redirect unauthenticated users to login from a public page.

### L-6 — `getTrainersByFilters` loads the entire table; pagination is client-side
**Severity:** Low (DoS-adjacent)
**Files:** `service/trainers.ts`, `app/entrenadores/page.tsx`

No `LIMIT/OFFSET` in the query. The page fetches every visible trainer and slices in JS. Repeated requests force full-table reads.

**Remediation:** push pagination into SQL (`LIMIT $perPage OFFSET $offset` plus a `count(*)` for total pages).

---

## INFO / DEFENSE-IN-DEPTH

### I-1 — Known-moderate npm vulnerabilities
`npm audit --omit=dev` currently reports moderate advisories for `ws` 8.x (uninitialized-memory disclosure, GHSA-58qx-3vcg-4xpx) and transitively via `resend` (`uuid`/`svix`). None are directly reachable from user input.

**Remediation:** `npm audit fix` (no `--force`) to pick up available patches. Track upstream releases for `next` and `drizzle-kit`.

### I-2 — Several HTTP security headers are missing
**Files:** `next.config.mjs`

Currently set: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

Missing:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` (even report-only would catch future XSS regressions)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-site`

### I-3 — `'use server'` directive is wrong on Page files
**Files:** `app/cuenta/page.tsx`, `app/entrenadores/page.tsx`, `app/soy-entrenador/page.tsx`, `app/signup/page.tsx`, `app/login/page.tsx`, `app/entrenadores/[id]/page.tsx`

`'use server'` marks a module as Server Actions (RPC-callable from the client), not a server component. Server components are server-by-default and need no directive. These pages still render correctly today but the directive is incorrect and may cause issues with future Next.js versions.

**Remediation:** delete the `'use server'` line from each of these page files.

### I-4 — Dev/test packages listed under production `dependencies`
**Files:** `package.json`

`playwright`, `nock`, `node-gyp`, and a self-referencing `"buscarentrenador.com": "file:"` are under `dependencies`. This inflates the deploy bundle and the supply-chain surface.

**Remediation:** move `playwright` and `nock` to `devDependencies`, remove `node-gyp` if not needed at runtime, and delete the self-referencing entry.

---

## Quick remediation order (pre-launch blockers first)

1. **H-1** — rotate every secret in `.env.local` (treat as compromised).
2. **M-7** — make `ServerError.clientMessage` always generic.
3. **M-6** — add length caps to the trainer endpoint.
4. **M-8** — remove trainer emails from public queries or gate behind auth.
5. **I-2** — add HSTS + report-only CSP before the custom domain goes live.
6. **I-3** — delete the wrong `'use server'` directives from page files.
7. **L-1, L-4, L-5, L-6** — as time allows.
8. **I-1, I-4** — routine maintenance.
