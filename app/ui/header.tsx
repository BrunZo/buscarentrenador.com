import Link from "next/link";
import { auth, signOut } from '@/auth';

export default async function Header() {
  const session = await auth()

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
          {session && <>
            <MenuButton
              text='Inicio'
              href='/'
            />
            <MenuButton
              text='Entrenadores'
              href='/entrenadores'
            />
            <MenuButton
              text='Soy entrenador'
              href='/soy-entrenador'
            />
            <li>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button className='text-gray-600 hover:text-black hover:underline'>
                  <div className="hidden md:block">Logout</div>
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
  text: string;
  href: string;
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