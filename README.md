# Buscarentrenador.com

A platform for finding trainers for the Argentine Mathematical Olympiad.

## Features

- User authentication with BetterAuth
- PostgreSQL database
- Trainer profiles and search
- User dashboard

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Authentication**: BetterAuth (NextAuth.js v5)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Install PostgreSQL on your system
2. Create a new database named `buscarentrenador`
3. Copy the environment variables:

```bash
cp env.example .env.local
```

4. Update the `.env.local` file with your database credentials:

```env
POSTGRES_USER=your_username
POSTGRES_HOST=localhost
POSTGRES_DATABASE=buscarentrenador
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret
```

5. Generate a NextAuth secret:

```bash
openssl rand -base64 32
```

6. Initialize the database:

```bash
npm run init-db
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

The application uses the following main tables:

- **users**: User accounts with authentication
- **trainers**: Trainer profiles linked to users
- **sessions**: BetterAuth session management
- **verification_tokens**: BetterAuth email verification

## Authentication Flow

1. Users can register with email, password, name, and surname
2. Passwords are hashed using bcrypt
3. Login uses BetterAuth with credentials provider
4. Sessions are managed with JWT strategy
5. Protected routes redirect to login if not authenticated

## API Routes

- `/api/auth/[...nextauth]`: BetterAuth API routes
- `/api/auth/signup`: User registration endpoint

## Migration from Supabase

This project has been migrated from Supabase to:
- BetterAuth for authentication
- PostgreSQL for database
- Custom database connection pool

The migration removes the dependency on Supabase while maintaining the same functionality.
