# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # on Vercel production builds only, runs migrations then build; no-op migration step elsewhere
npm run lint         # ESLint via next lint
npx playwright test  # run all E2E tests
npx playwright test tests/login.spec.ts  # run a single test file
```

There are no unit tests — only Playwright E2E tests in `tests/`.

## Architecture

**Stack:** Next.js App Router, React 19, TypeScript, Drizzle ORM, PostgreSQL (via `@vercel/postgres`), BetterAuth, Tailwind CSS, Resend (email), Zod (validation).

### Layer structure

```
db/          — Drizzle schema + db client
service/     — business logic; no auth checks here
  auth/      — BetterAuth instance (auth.ts) and client helper (auth-client.ts)
  trainers.ts, users.ts — DB queries; mutations take userId from caller, not trainerId; keep as simple as possible
  mailer.ts  — Resend email via HTML/text templates in service/templates/
  errors.ts  — AppError hierarchy (JsonError, UnauthorizedError, TrainerNotFoundError, …)
  loc/       — Location data (provinces/cities)
app/api/     — Next.js route handlers; the only client-facing entrypoint; handles the auth
  helper.ts  — handleServiceError(): maps AppError/ZodError → NextResponse
app/ui/      — React components (all mutations via fetch to /api/…, NEVER import service/)
```

### Auth and authorization pattern

BetterAuth is the auth provider. All its routes are handled by `app/api/auth/[...all]/route.ts`.

Every mutating API route follows this exact pattern:
1. `auth.api.getSession({ headers: await headers() })` — verify session, throw `UnauthorizedError` if absent
2. Parse + validate request body with Zod
3. Call service function, passing `session.user.id` (never a caller-supplied record ID)
4. Wrap in `try/catch` → `handleServiceError(error)`

### Database

Schema is in `db/schema.ts`. Migrations are managed by Drizzle Kit (`migrations/` directory). `npm run build` runs `drizzle-kit migrate` only when `VERCEL_ENV=production` (i.e. real production deploys), so preview builds never touch the prod DB. To generate a new migration after schema changes:

```bash
npx drizzle-kit generate
```

The `users.id` is `varchar` (BetterAuth-managed UUID string), not a serial integer. The `trainers.id` is a serial integer.

### Email templates

HTML and plain-text templates live in `service/templates/`. Variables use `{{name}}` syntax and are interpolated by `mailer.ts`. Templates: `verify-email`, `reset-password`.

### Environment variables

Required in `.env.local`:
- `POSTGRES_URL` — used by `@vercel/postgres` and Drizzle Kit
- `BETTER_AUTH_SECRET` — BetterAuth session signing
- `NEXT_PUBLIC_APP_URL` — used for email callback URLs
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth
- `RESEND_API_KEY` / `RESEND_FROM_NAME` / `RESEND_FROM_EMAIL` — transactional email
