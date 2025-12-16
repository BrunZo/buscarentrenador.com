'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className='flex justify-between items-center py-4 px-4 sm:px-32 relative'>
      <Link
        className='text-indigo-600 text-xl font-bold'
        href={'/'}
        onClick={closeMenu}
      >
        Buscarentrenador.com
      </Link>
      
      {/* Botón hamburguesa - solo visible en móvil */}
      <button
        onClick={toggleMenu}
        className='sm:hidden p-2 text-gray-600 hover:text-black'
        aria-label='Toggle menu'
      >
        {isMenuOpen ? (
          <XMarkIcon className='h-6 w-6' />
        ) : (
          <Bars3Icon className='h-6 w-6' />
        )}
      </button>

      {/* Menú desktop - visible desde sm */}
      <nav className='hidden sm:block'>
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
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Menú móvil desplegable - visible solo cuando está abierto en móvil */}
      {isMenuOpen && (
        <nav className='absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg sm:hidden z-50'>
          <ul className='flex flex-col py-4'>
            {!session && status !== 'loading' && (
              <>
                <MobileMenuButton
                  text='Login'
                  href='/login'
                  onClick={closeMenu}
                />
                <MobileMenuButton
                  text='Registrarse'
                  href='/signup'
                  onClick={closeMenu}
                />
              </>
            )}
            {session && (
              <>
                <MobileMenuButton
                  text='Inicio'
                  href='/'
                  onClick={closeMenu}
                />
                <MobileMenuButton
                  text='Entrenadores'
                  href='/entrenadores'
                  onClick={closeMenu}
                />
                <MobileMenuButton
                  text='Mi cuenta'
                  href='/cuenta'
                  onClick={closeMenu}
                />
                <li>
                  <button 
                    onClick={() => {
                      closeMenu();
                      signOut({ callbackUrl: '/' });
                    }}
                    className='w-full text-left px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50'
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
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

function MobileMenuButton({ text, href, onClick }: {
  text: string
  href: string
  onClick: () => void
}) {
  return (
    <li>
      <Link
        className='block px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50'
        href={href}
        onClick={onClick}
      >
        {text}
      </Link>
    </li>
  )
}