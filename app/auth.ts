'use server'

import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decrypt, encrypt } from './jwt';
import { NextRequest, NextResponse } from 'next/server';
import { User } from './lib/definitions'

type Response<T> = {
  status: number
  msg?: string
  payload?: T
}

async function getUser(email: string): Promise<Response<User>> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return { status: 200, payload: user.rows[0] }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return { status: 500, msg: 'Failed to fetch user.' }
  }
}

async function getUserById(id: string): Promise<Response<User>> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE id=${id}`;
    return { status: 200, payload: user.rows[0] }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return { status: 500, msg: 'Failed to fetch user.' }
  }
}

export async function signIn(email: string, pass: string) {
  try {
    const response = await getUser(email)
    if (response.status !== 200) 
      return { status: 401, msg: 'Usuario no encontrado' }

    const user = response.payload
    if (!user)
      return { status: 401, msg: 'Usuario no encontrado' }
    
    const passwordMatch = bcrypt.compare(pass, user.password)
    if (!passwordMatch) 
      return { status: 401, msg: 'Contraseña incorrecta' }

    const expires = new Date(Date.now() + 1000 * 60 * 60)
    const session = await encrypt({ user: user.id, expires })

    cookies().set('session', session, { expires, httpOnly: true })
    
    return { status: 200, msg: 'Inicio de sesión exitoso' }
  }
  catch (error) {
    console.error('Hubo un error inesperado:', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}

export async function signUp(credentials: any) {
  try {
    const { email, username, password } = credentials

    const existingUser = await getUser(email)
    if (existingUser)
      return { status: 400, msg: 'El usuario ya existe' }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql<User>`INSERT INTO users (email, name, password) 
                    VALUES (${email}, ${username}, ${hashedPassword})`;

    return { status: 200, msg: 'Usuario creado' }
  }
  catch (error) {
    console.error('Hubo un error inesperado:', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}

export async function updateData(data: any) {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }

  const parsed = await decrypt(session.value)
  if (!parsed)
    return { status: 401, msg: 'No hay sesión activa' }

  const { prov, loc, 
          modal0, modal1, modal2, 
          form0, form1, level0, 
          level1, level2, level3, level4 } = data

  try {
    await sql<User>`UPDATE users
                    SET prov=${prov}, loc=${loc}, 
                        modal=${[modal0, modal1, modal2].join(',')},
                        form=${[form0, form1].join(',')},
                        level=${[level0, level1, level2, level3, level4].join(',')},
                        entr=${true}
                    WHERE id=${parsed.user as string};`

    return { status: 200, msg: 'Datos actualizados' }
  }
  catch (error) {
    console.error('Hubo un error inesperado:', error)
    return { status: 500, msg: 'Hubo un error inesperado' }
  }
}

export async function signOut() {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }

  cookies().delete('session')
  redirect('/')
}

export async function updateSession(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  if (!session)
    return req

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 1000 * 60 * 60)

  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires as Date,
  })

  return res
}

export async function isUser() {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }

  const parsed = await decrypt(session.value)
  if (!parsed)
    return { status: 401, msg: 'No hay sesión activa' }

  return { status: 200, msg: 'Usuario autenticado', payload: true }
}  

export async function getUserData() {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }

  const parsed = await decrypt(session.value)
  if (!parsed)
    return { status: 401, msg: 'No hay sesión activa' }

  const user = await getUserById(parsed.user as string)
  if (user.status !== 200)
    return { status: 500, msg: 'Hubo un error inesperado' }

  return { status: 200, payload: user.payload }  
} 