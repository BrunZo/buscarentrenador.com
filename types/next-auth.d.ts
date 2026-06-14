import NextAuth from "next-auth"
import type { UserRole } from "@/types/users"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      surname: string
      role: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name: string
    surname: string
    // Optional on sign-in: Google's profile has no role; it is resolved from
    // the database in the jwt callback. New users fall back to the DB default.
    role?: UserRole
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    surname: string
    role: UserRole
  }
}
