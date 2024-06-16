'use server'

import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { User } from '@/app/lib/definitions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByID(id: number): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE id=${id}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getSession() {
  const session = cookies().get('session')
  if (!session?.value)
    return { 
      isLoggedIn: false,
      isEntrenador: false
    }
  return JSON.parse(session.value)
}

export async function esEntrenador() {
  const session = await getSession()
  if (!session.isLoggedIn)
    return false
  const user = await getUser(session.userId)
  return user?.entr
}

export async function signIn(email: string, pass: string) {
  try {
    const user = await getUser(email)
    if (!user) 
      return { status: 401, msg: 'Usuario no encontrado' }
    
    const passwordMatch = bcrypt.compare(pass, user.pass)
    if (!passwordMatch) 
      return { status: 401, msg: 'Contraseña incorrecta' }

    const session = {
      userId: user.id,
      isLoggedIn: true,
      isEntrenador: user.entr
    }

    cookies().set({
      name: 'session',
      value: JSON.stringify(session),
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60)
    })

    return { status: 200, msg: 'Inicio de sesión exitoso' }
  } catch (error) {
    throw error
  }
}

export async function updateSession() {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }
  const data = JSON.parse(session.value)
  const user = await getUser(data.userId)
  if (!user)
    return { status: 401, msg: 'Usuario no encontrado' }
  const newSession = {
    userId: user?.id,
    isLoggedIn: true,
    isEntrenador: user?.entr
  }
  cookies().set({
    name: 'session',
    value: JSON.stringify(newSession),
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 1000 * 60 * 60)
  })
}

export async function signOut() {
  const session = cookies().get('session')
  if (!session)
    return { status: 401, msg: 'No hay sesión activa' }
  cookies().delete('session')
  redirect('/')
}