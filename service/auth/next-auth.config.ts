import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyLogin } from "@/service/auth/login";
import { getUserByEmail, createGoogleUser, getUserByGoogleId } from "@/data/users";

function splitGoogleName(profile: { name?: string | null; given_name?: string; family_name?: string }) {
  const given = profile.given_name?.trim();
  const family = profile.family_name?.trim();
  if (given && family) return { name: given, surname: family };

  const fullName = profile.name?.trim() ?? '';
  const parts = fullName.split(/\s+/).filter(Boolean);

  return {
    name: given || parts[0] || 'Usuario',
    surname: family || parts.slice(1).join(' ') || '-',
  };
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const user = await verifyLogin(credentials.email as string, credentials.password as string);
          return user;
        } catch (error) {
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

      const existingByGoogleId = await getUserByGoogleId(googleId);
      if (existingByGoogleId) {
        user.id = existingByGoogleId.id;
        user.email = existingByGoogleId.email;
        user.name = existingByGoogleId.name;
        user.surname = existingByGoogleId.surname;
        return true;
      }

      const email = user?.email ?? profile?.email;
      if (!email) return '/login?error=google_no_email';
      const { name, surname } = splitGoogleName(profile ?? {});

      const existingByEmail = await getUserByEmail(email);

      if (existingByEmail) {
        if (existingByEmail.auth_provider !== 'google') {
          return '/login?error=email_in_use_credentials';
        }
        user.id = existingByEmail.id;
        user.email = existingByEmail.email;
        user.name = existingByEmail.name;
        user.surname = existingByEmail.surname;
        return true;
      }

      const created = await createGoogleUser({
        email,
        name: user.name ?? name,
        surname: user.surname ?? surname,
        google_id: googleId,
      });
      if (!created) return '/login?error=google_signup_failed';

      user.id = created.id;
      user.email = created.email;
      user.name = created.name;
      user.surname = created.surname;
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
