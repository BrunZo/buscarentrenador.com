import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import pool from "./db";
import NextAuth from "next-auth";
import crypto from "crypto";

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

        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT id, email, password_hash, name, surname, email_verified FROM users WHERE email = $1",
            [credentials.email]
          );

          const user = result.rows[0];
          if (!user) {
            return null;
          }

          const isPasswordValid = await compare(credentials.password, user.password_hash);
          if (!isPasswordValid) {
            return null;
          }

          // Check if email is verified - return user with error flag
          if (!user.email_verified) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
          };
        } finally {
          client.release();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.surname = user.surname;
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

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function createUser(email: string, password: string, name: string, surname: string) {
  const hashedPassword = await hashPassword(password);
  const verificationToken = generateVerificationToken();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, name, surname, email_verified, verification_token, verification_token_expires) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, name, surname, verification_token",
      [email, hashedPassword, name, surname, false, verificationToken, tokenExpires]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserById(id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, email, name, surname FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserByEmail(email: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, email, name, surname, email_verified FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function verifyUserEmail(token: string): Promise<{ success: boolean; error?: string }> {
  const client = await pool.connect();

  try {
    // Find user with this token
    const result = await client.query(
      "SELECT id, email, email_verified, verification_token_expires FROM users WHERE verification_token = $1",
      [token]
    );

    const user = result.rows[0];
    if (!user) {
      return { success: false, error: "Token inválido" };
    }

    // Check if already verified
    if (user.email_verified) {
      return { success: false, error: "El correo ya está verificado" };
    }

    // Check if token is expired
    if (new Date() > new Date(user.verification_token_expires)) {
      return { success: false, error: "El token ha expirado" };
    }

    // Update user to verified and clear token
    await client.query(
      "UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = $1",
      [user.id]
    );

    return { success: true };
  } finally {
    client.release();
  }
}

export async function regenerateVerificationToken(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const client = await pool.connect();

  try {
    // Check if user exists
    const userResult = await client.query(
      "SELECT id, email_verified FROM users WHERE email = $1",
      [email]
    );

    const user = userResult.rows[0];
    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Check if already verified
    if (user.email_verified) {
      return { success: false, error: "El correo ya está verificado" };
    }

    // Generate new token
    const newToken = generateVerificationToken();
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Update user with new token
    await client.query(
      "UPDATE users SET verification_token = $1, verification_token_expires = $2 WHERE id = $3",
      [newToken, tokenExpires, user.id]
    );

    return { success: true, token: newToken };
  } finally {
    client.release();
  }
}
