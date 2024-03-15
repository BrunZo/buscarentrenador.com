import Link from "next/link";

export default function Header() {
  return (
    <div className='flex justify-between items-center py-4 px-32'>
      <Logo/>
      <Menu/>
    </div>
  )
}

export function Logo() {
  return (
    <h1 className='text-blue-600 text-xl font-bold'>Buscarentrenador.com</h1>
  )
}

export function Menu() {
  return (
    <nav>
      <ul className='flex gap-8 items-center'>
        <li>
          <MenuButton
            text='Inicio'
            href='/'
          />
        </li>
        <li>
          <MenuButton
            text='Entrenadores'
            href='/entrenadores'
          />
        </li>
        <li>
          <MenuButton
            text='Login'
            href='/login'
          />
        </li>
      </ul>
    </nav>
  )
}

export function MenuButton({ text, href }: {
  text: string;
  href: string;
}) {
  return (
    <Link
      className='text-gray-600 hover:text-black hover:underline'
      href={href}
    >
      {text}
    </Link>
  )
}