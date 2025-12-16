import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcrypt";
import pool from "./db";
import NextAuth from "next-auth";

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

        // TODO: Remove this after testing
        if (credentials.email === 'admin@admin.com' && credentials.password === 'admin') {
          return {
            id: '1',
            email: 'admin@admin.com',
            name: 'Admin',
            surname: '-',
          };
        }

        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT id, email, password_hash, name, surname FROM users WHERE email = $1",
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

          return {
            id: user.id.toString(),
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
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.surname = token.surname as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { auth, handlers } = NextAuth(authConfig);

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function createUser(email: string, password: string, name: string, surname: string) {
  const hashedPassword = await hashPassword(password);
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      "INSERT INTO users (email, password_hash, name, surname) VALUES ($1, $2, $3, $4) RETURNING id, email, name, surname",
      [email, hashedPassword, name, surname]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function getUserById(id: string) {
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
      "SELECT id, email, name, surname FROM users WHERE email = $1",
      [email]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}
