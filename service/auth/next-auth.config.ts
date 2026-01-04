import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyLogin } from "./login";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          return await verifyLogin(credentials.email, credentials.password);
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.surname = user.surname;
      }
      
      if (trigger === "update" && session) {
        token.name = session.name;
        token.surname = session.surname;
      }
      
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as number;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.surname = token.surname as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { auth, handlers } = NextAuth(authConfig);
