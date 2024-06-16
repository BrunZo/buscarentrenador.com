'use server';

import { sql } from '@vercel/postgres';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getSession, getUser, signIn, updateSession } from '@/auth';
import { User } from '@/app/lib/definitions';

export async function login(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
  try {
    const parsedCredentials = z
      .object({
        email: z.string().email(),
        pass: z.string().min(6),
      })
      .safeParse(Object.fromEntries(formData))

    if (!parsedCredentials.success)
      return {
        status: 400,
        msg: 'Error de validación',
      }

    const { email, pass } = parsedCredentials.data
    const response = await signIn(email, pass)

    return response
  } catch (error) {
    return {
      status: 500,
      msg: 'Hubo un error inesperado',
    }
  }
}

export async function createUser(
  prevState: { status: number, msg: string } | undefined,
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

    if (!parsedCredentials.success) {
      return {
        status: 400,
        msg: 'Error de validación',
      }
    }

    const { email, username, password, repeat } = parsedCredentials.data;
    const existingUser = await getUser(email);
    if (existingUser)
      return {
        status: 400,
        msg: 'El usuario ya existe',
      }

    if (password !== repeat)
      return {
        status: 400,
        msg: 'Las contraseñas no coinciden',
      }

    const hashedPassword = await bcrypt.hash(password, 10);

    // mover a db.ts
    await sql<User>`INSERT INTO users (email, name, password) VALUES (${email}, ${username}, ${hashedPassword})`;

    return { status: 200, msg: 'Usuario creado' }
  } catch (error) {
    console.error('Hubo un error inesperado.', error)
    return {
      status: 500,
      msg: 'Hubo un error inesperado',
    }
  }
}

export async function updateUser(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
  const session = await getSession()

  if (!session.isLoggedIn)
    return {
      status: 401,
      msg: 'No estás autorizado',
    }

  try {
    // simplificar??
    const parsedData = z
      .object({
        prov: z.string(),
        loc: z.string(),
        modal0: z.string().default('off'),
        modal1: z.string().default('off'),
        modal2: z.string().default('off'),
        form0: z.string().default('off'),
        form1: z.string().default('off'),
        level0: z.string().default('off'),
        level1: z.string().default('off'),
        level2: z.string().default('off'),
        level3: z.string().default('off'),
        level4: z.string().default('off'),
      })
      .safeParse(Object.fromEntries(formData))

    if (!parsedData.success) {
      return {
        status: 400,
        msg: 'Error de validación',
      }
    }

    const { prov, loc,
            modal0, modal1, modal2,
            form0, form1,
            level0, level1, level2, level3, level4 } = parsedData.data;

    await sql<User>`UPDATE users
                    SET prov=${prov}, loc=${loc}, 
                        modal=${[modal0, modal1, modal2].join(',')},
                        form=${[form0, form1].join(',')},
                        level=${[level0, level1, level2, level3, level4].join(',')},
                        entr=${true}
                    WHERE id=${session.userId};`

    updateSession()

    return {
      status: 200,
      msg: 'Usuario actualizado',
    }
  } catch (error) {
    console.error('Hubo un error inesperado.', error)
    return {
      status: 500,
      msg: 'Hubo un error inesperado',
    }
  }
}