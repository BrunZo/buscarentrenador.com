'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';
import { getTrainer } from '../utils/supabase/queries';

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
  const parsedData = z
    .object({
      prov: z.string(),
      city: z.string(),
      place0: z.string().default('off'),
      place1: z.string().default('off'),
      place2: z.string().default('off'),
      group0: z.string().default('off'),
      group1: z.string().default('off'),
      level0: z.string().default('off'),
      level1: z.string().default('off'),
      level2: z.string().default('off'),
      level3: z.string().default('off'),
      level4: z.string().default('off'),
    })
    .safeParse(Object.fromEntries(formData))

  if (!parsedData.success)
    return { status: 400, msg: 'Error de validación' }

  const supabase = createClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (!authData?.user || authError) 
    return { status: 401, msg: 'No autorizado' }

  const currTrainer = await getTrainer(supabase)
  if (currTrainer)
    await supabase.from('trainers').insert({ user_id: authData.user.id })

  const city = await supabase.from('cities').select().eq('name', parsedData.data.city)
  const { error } = await supabase.from('trainers').update({
    user_id: authData.user.id,
    city: (city.data && city.data.length > 0) ? city.data[0].id : null,
    place: [
      parsedData.data.place0,
      parsedData.data.place1,
      parsedData.data.place2,
    ],
    group: [
      parsedData.data.group0,
      parsedData.data.group1,
    ],
    level: [
      parsedData.data.level0,
      parsedData.data.level1,
      parsedData.data.level2,
      parsedData.data.level3,
      parsedData.data.level4,
    ]
  }).eq('user_id', authData.user.id)

  if (error) {
    console.error('Hubo un error inesperado.', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
  
  return { status: 200, msg: 'Datos actualizados exitosamente' }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error)
    console.error('Hubo un error inesperado.', error)

  redirect('/')
}