import { createClient } from '@/app/utils/supabase/server'
import { signOut } from '@/app/lib/actions'
import Link from 'next/link'

export default async function Header() {
  'use server'
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()

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
          {!data?.session && <>
            <MenuButton
              text='Login'
              href='/login'
            />
          </>}
          {data?.session && <>
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
            {true &&
              <MenuButton
                text='Soy entrenador'
                href='/soy-entrenador'
              />
            }
            <li>
              <form action={signOut}>
                <button className='text-gray-600 hover:text-black hover:underline'>
                  <div className='hidden md:block'>Logout</div>
                </button>
              </form>
            </li>
          </>}
        </ul>
      </nav>
    </div>
  )
}

export function MenuButton({ text, href }: {
  text: string
  href: string
}) {
  'use client'
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