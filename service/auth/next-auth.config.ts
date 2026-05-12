import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyLogin } from "@/service/auth/login";
import { handleGoogleSignIn } from "@/service/auth/signup";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          return await verifyLogin(credentials.email as string, credentials.password as string);
        } catch {
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider !== 'google') return true;

      const googleId = account.providerAccountId;
      if (!googleId) return '/login?error=google_signup_failed';

      const email = user?.email ?? profile?.email;
      if (!email) return '/login?error=google_no_email';

      const result = await handleGoogleSignIn(googleId, email, profile ?? {});
      if (typeof result === 'string') return result;

      user.id = result.id;
      user.email = result.email;
      user.name = result.name;
      user.surname = result.surname;
      return true;
    },
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
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.surname = token.surname;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export const { auth, handlers } = NextAuth(authConfig);
