# Buscarentrenador.com

A platform for finding math olympiad trainers in Argentina.

## Tech Stack

- **Frontend**: Next.js App Router, React 19, TypeScript, Tailwind CSS
- **Authentication**: BetterAuth (email/password + Google OAuth)
- **Database**: PostgreSQL via Drizzle ORM (`@vercel/postgres`)
- **Email**: Resend

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with:

```env
POSTGRES_URL=postgresql://user:password@localhost:5432/buscarentrenador

BETTER_AUTH_SECRET=<openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=http://localhost:3000

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

RESEND_API_KEY=
RESEND_FROM_NAME=BuscarEntrenador
RESEND_FROM_EMAIL=noreply@buscarentrenador.com
```

### 3. Run the development server

```bash
npm run dev
```

Migrations run automatically on `npm run build`. To generate a new migration after schema changes:

```bash
npx drizzle-kit generate
```

## Database Schema

- **users** — accounts managed by BetterAuth (`id` is a varchar UUID)
- **trainers** — trainer profiles linked to users (`id` is a serial integer)
- **sessions / accounts / verifications / rateLimits** — BetterAuth internal tables

## API Routes

Custom mutation routes (all require an authenticated session):

- `POST /api/auth/trainer` — create or update trainer profile
- `PATCH /api/auth/trainer/visibility` — toggle trainer visibility
- `PATCH /api/auth/user` — update user name/surname

BetterAuth handles all auth flows (sign-up, sign-in, email verification, password reset, Google OAuth) via `/api/auth/[...all]`.
