'use client'

import { Entrenador } from '@/app/ui/entrenadores/card'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Info from '../entrenadores/info'

export default function Dashboard({ user }: {
  user: Entrenador
}) {
  const [selected, setSelected] = useState(0)

  return (
    <>
      <div className='flex gap-4'>
        <VerticalNavbar
          options={['Mi cuenta', 'Perfil de entrenador', 'Mis alumnos']}
          selected={selected}
          handler={setSelected}
        />
        {selected === 0 && <Cuenta/>}
        {selected === 1 && <Perfil entr={user}/>}
        {selected === 2 && <Alumnos/>}
      </div>
    </>
  )
}

function VerticalNavbar({ options, selected, handler }: {
  options: string[]
  selected: number
  handler: (i: number) => void
}) {
  return (
    <div className='flex flex-col gap-2 w-96'>
      {options.map((option, i) => (
        <div key={i} className={clsx({
          'p-2 rounded-md cursor-pointer': true,
          'bg-gray-200': i === selected,
          'hover:bg-gray-50': i !== selected
        })} onClick={() => handler(i)}>
          {option}
        </div>
      ))} 
    </div>
  )
}

function Cuenta() {
  return (
    <div className='space-y-2 w-full'>
      <h2 className='text-xl font-semibold'>Mi cuenta</h2>
      <p>
        Acá podrás ver la información de tu cuenta.
      </p>
    </div>
  )
}

function Perfil({ entr }: {
  entr: Entrenador
}) {
  const router = useRouter()

  return (
    <div className='space-y-2 w-full'>
      <h2 className='text-xl font-semibold'>Perfil de entrenador</h2>
      <p>
        Acá podrás ver la información de tu perfil de entrenador.
      </p>
      <div className='p-3 border border-gray-200 rounded-md'>
        <Info entrenador={entr}/>
      </div>
      <button
        className={clsx({
          'w-full flex justify-center py-2 px-4': true,
          'border border-transparent rounded-md shadow-sm text-sm font-medium text-white': true,
          'bg-indigo-600 hover:bg-indigo-700': true,
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true
        })}
        onClick={() => router.push('/soy-entrenador')}
      >
        Editar perfil
      </button>
    </div>
  )
}

function Alumnos() {
  return (
    <div className='space-y-2 w-full'>
      <h2 className='text-xl font-semibold'>Mis alumnos</h2>
      <p>
        Acá podrás ver la información de tus alumnos.
      </p>
    </div>
  )
}