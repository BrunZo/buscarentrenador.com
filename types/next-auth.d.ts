import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      email: string
      name: string
      surname: string
    }
  }

  interface User {
    id: number
    email: string
    name: string
    surname: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    email: string
    name: string
    surname: string
  }
}
