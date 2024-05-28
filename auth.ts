import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import type { User } from '@/app/lib/definitions';
 
export async function getUser({email, username}: {
  email?: string
  username?: string
}): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email} OR name=${username}`;
    return user.rows[0];
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    throw new Error('Error al buscar usuario.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            name: z.string(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

          if (parsedCredentials.success) {
            const { name, password } = parsedCredentials.data;
            const user = await getUser({
              email: name,
              username: name
            });
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);
   
            if (passwordsMatch) return user;
          }
   
          console.log('Usuario o contraseña incorrectos.');
          return null;
      },
    }),
  ],
});