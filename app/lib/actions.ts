'use server';

import { getUser, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { User } from './definitions';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Usuario o contraseña incorrectos.';
        default:
          return 'Hubo un error inesperado.';
      }
    }
    throw error;
  }
}

export async function createUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const parsedCredentials = z
      .object({
        email: z.string().email(),
        username: z.string(),
        password: z.string().min(6),
        repeat: z.string().min(6)
      })
      .safeParse(Object.fromEntries(formData))

    if (parsedCredentials.success) {
      const { email, username, password, repeat } = parsedCredentials.data;
      const existingUser = await getUser({ email, username });
      if (existingUser)
        return "Ya existe un usuario con ese email o nombre de usuario";
      if (password !== repeat)
        return "Las contraseñas no coinciden";
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql<User>`INSERT INTO users (email, name, password) VALUES (${email}, ${username}, ${hashedPassword})`;
      return "200";
    }

    console.log('Error de validación');
    return 'Error de validación';
  } catch (error) {
    console.error('Hubo un error inesperado.', error);
    return 'Hubo un error inesperado.';
  }
}