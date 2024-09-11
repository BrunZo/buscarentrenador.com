'use client'

import { User } from '@/app/lib/definitions'
import { Card } from '@/app/ui/entrenadores/card'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

export default function Dashboard({ userData } : {
  userData: User
}) {
  const router = useRouter()

  return (
    <>
      <h2 className='text-xl font-semibold'>Perfil de entrenador</h2>
      <div className='space-y-2 w-full'>
        <p>
          Así se verá tu perfil en la página de entrenadores:
        </p>
        <Card {...userData}/>
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
    </>
  )
}