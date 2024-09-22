'use server';

import { z } from 'zod';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
  const parsedCredentials = z
    .object({
      email: z.string().email(),
      pass: z.string().min(6),
    })
    .safeParse(Object.fromEntries(formData))
  if (!parsedCredentials.success)
    return { status: 400, msg: 'Error de validación', }
  const { email, pass } = parsedCredentials.data

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: pass, 
  })
 
  if (!data)
    return { status: 401, msg: 'Usuario o contraseña incorrectos' } 

  if (error) {
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }

  return { status: 200, msg: 'Inicio de sesión exitoso' }
}

export async function signUp(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
  const parsedCredentials = z
    .object({
      email: z.string().email(),
      name: z.string(),
      surname: z.string(),
      password: z.string().min(6),
      repeat: z.string().min(6)
    })
    .safeParse(Object.fromEntries(formData))

  if (!parsedCredentials.success) 
    return { status: 400, msg: 'Error de validación', }

  const { email, name, surname, password, repeat } = parsedCredentials.data

  if (password !== repeat)
    return { status: 400, msg: 'Las contraseñas no coinciden' }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
        surname: surname
      }
    }
  })

  if (error) {
    if (error.message.includes('already exists'))
      return { status: 400, msg: 'El correo ya está registrado' }
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
  
  return { status: 200, msg: 'Usuario creado exitosamente' }

}

export async function updateUser(
  prevState: { status: number, msg: string } | undefined,
  formData: FormData,
) {
  try {
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
    
    return { status: 200, msg: 'Datos actualizados exitosamente' }
  }
  catch (error) {
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  redirect('/')
}