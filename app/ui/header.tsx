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
    <div className='flex justify-between items-center py-4 px-4 sm:px-32 relative bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-soft'>
      <Link
        className='text-xl font-bold gradient-text hover:scale-105 transition-transform duration-200'
        href={'/'}
        onClick={closeMenu}
      >
        Buscarentrenador.com
      </Link>
      
      {/* Botón hamburguesa - solo visible en móvil */}
      <button
        onClick={toggleMenu}
        className='sm:hidden p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200'
        aria-label='Toggle menu'
      >
        {isMenuOpen ? (
          <XMarkIcon className='h-6 w-6' />
        ) : (
          <Bars3Icon className='h-6 w-6' />
        )}
      </button>

      {/* Menú desktop - visible desde sm */}
      <nav className='hidden sm:block z-50'>
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
                  className='text-gray-700 hover:text-red-600 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200'
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
        <nav className='absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-large sm:hidden z-50 animate-slide-in'>
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
                    className='w-full text-left px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200'
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
        className='text-gray-700 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 relative group'
        href={href}
      >
        {text}
        <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300'></span>
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
        className='block px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium'
        href={href}
        onClick={onClick}
      >
        {text}
      </Link>
    </li>
  )
}