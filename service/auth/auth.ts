import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { compare } from "bcrypt";
import { db } from "@/db/index";
import * as schema from "@/db/schema";
import { hashPassword } from "@/service/crypto";
import { mailer } from "@/service/mailer";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;

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

function validatePassword(password: unknown) {
  if (typeof password !== "string" || !passwordRegex.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message:
        "La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula y dígitos",
    });
  }
}

function validateName(value: unknown, label: string) {
  if (
    typeof value !== "string" ||
    value.trim().length < 2 ||
    !nameRegex.test(value)
  ) {
    throw new APIError("BAD_REQUEST", {
      message: `${label} solo puede contener letras, números y espacios (mínimo 2 caracteres)`,
    });
  }
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  user: {
    modelName: "users",
    additionalFields: {
      surname: { type: "string", required: true, input: true },
    },
  },
  session: { modelName: "sessions" },
  account: {
    modelName: "accounts",
    // I learnt that the reason for this is that if anyone posess the account
    // alice@gmail.com, linking allows him/her to control all alice@example.com
    accountLinking: { enabled: false },
  },
  verification: { modelName: "verifications" },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    resetPasswordTokenExpiresIn: 60 * 60,
    // Keep bcrypt (instead of Better Auth's default scrypt) so hashes
    // migrated from the previous auth system keep working.
    password: {
      hash: (password) => hashPassword(password),
      verify: ({ hash, password }) => compare(password, hash),
    },
    sendResetPassword: async ({ user, url }) => {
      await mailer.sendPasswordReset(user.email, user.name, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    expiresIn: 24 * 60 * 60,
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&callbackURL=/verify-email`;
      await mailer.sendVerification(user.email, user.name, url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      mapProfileToUser: (profile) => splitGoogleName(profile),
    },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimits",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 10 },
      "/sign-up/email": { window: 60 * 60, max: 5 },
      "/request-password-reset": { window: 60 * 60, max: 5 },
      "/forget-password": { window: 60 * 60, max: 5 },
      "/reset-password": { window: 15 * 60, max: 5 },
      "/send-verification-email": { window: 60 * 60, max: 3 },
    },
  },
  hooks: {
    // Server-side input policy, mirroring what the old signup route enforced
    // with zod. Better Auth itself only checks minPasswordLength.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        validatePassword(ctx.body?.password);
        validateName(ctx.body?.name, "El nombre");
        validateName(ctx.body?.surname, "El apellido");
      }
      if (ctx.path === "/reset-password") {
        validatePassword(ctx.body?.newPassword);
      }
    }),
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
