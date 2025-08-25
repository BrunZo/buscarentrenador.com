'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <div className='flex justify-between items-center py-4 px-32'>
      <Link
        className='text-indigo-600 text-xl font-bold'
        href={'/'}
      >
        Buscarentrenador.com
      </Link>
      <nav>
        <ul className='flex gap-8 items-center'>
          {!session && status !== 'loading' && (
            <>
              <MenuButton
                text='Login'
                href='/login'
              />
              <MenuButton
                text='Registrarse'
                href='/signup'
              />
            </>
          )}
          {session && (
            <>
              <MenuButton
                text='Inicio'
                href='/'
              />
              <MenuButton
                text='Entrenadores'
                href='/entrenadores'
              />
              <MenuButton
                text='Mi cuenta'
                href='/cuenta'
              />
              <li>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className='text-gray-600 hover:text-black hover:underline'
                >
                  <div className='hidden md:block'>Logout</div>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}

export function MenuButton({ text, href }: {
  text: string
  href: string
}) {
  return (
    <li>
      <Link
        className='text-gray-600 hover:text-black hover:underline'
        href={href}
      >
        {text}
      </Link>
    </li>
  )
}