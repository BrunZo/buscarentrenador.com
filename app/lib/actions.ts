'use server';

import { z } from 'zod';
import { signIn, signUp, updateData } from '@/app/auth';

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
      return { status: 400, msg: 'Error de validación', }

    const { email, pass } = parsedCredentials.data
    return await signIn(email, pass)
  }
  catch (error) {
    console.error('Hubo un error inesperado:', error)
    return { status: 500, msg: 'Hubo un error inesperado', }
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

    if (!parsedCredentials.success) 
      return { status: 400, msg: 'Error de validación', }

    const { email, username, password, repeat } = parsedCredentials.data;

    if (password !== repeat)
      return { status: 400, msg: 'Las contraseñas no coinciden' }

    return await signUp({ email, username, password })
  }
  catch (error) {
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}

export async function updateUser(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
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
    
    return updateData(parsedData.data)            
  }
  catch (error) {
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}