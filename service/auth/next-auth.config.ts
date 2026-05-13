import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/index";
import { users, accounts } from "@/db/schema";
import { verifyLogin } from "@/service/auth/login";
import { getUserByEmail } from "@/service/users";

type NameParts = {
  name?: string | null;
  given_name?: string;
  family_name?: string;
};

function splitGoogleName(p: NameParts): { name: string; surname: string } {
  const given = p.given_name?.trim();
  const family = p.family_name?.trim();
  if (given && family) return { name: given, surname: family };

  const fullName = p.name?.trim() ?? "";
  const parts = fullName.split(/\s+/).filter(Boolean);
  return {
    name: given || parts[0] || "Usuario",
    surname: family || parts.slice(1).join(" ") || "-",
  };
}

export const authConfig: NextAuthConfig = {
  adapter: DrizzleAdapter(db, { usersTable: users, accountsTable: accounts }),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          return await verifyLogin(
            credentials.email as string,
            credentials.password as string,
          );
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      profile(profile) {
        const { name, surname } = splitGoogleName(profile);
        return {
          id: profile.sub,
          email: profile.email,
          name,
          surname,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account }) {
      if (account?.provider !== "google") return true;
      if (!profile?.email) return "/login?error=google_no_email";

      const existing = await getUserByEmail(profile.email);
      if (existing && existing.password_hash) {
        return "/login?error=email_in_use_credentials";
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.surname = (user as { surname?: string }).surname ?? "";
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.surname = session.surname;
      }
      return token;
    },
    async session({ session, token }) {
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

export const { auth, handlers, signIn } = NextAuth(authConfig);
