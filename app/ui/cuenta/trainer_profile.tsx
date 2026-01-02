'use client'

import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Info from "@/app/ui/entrenadores/info"
import { Trainer } from "@/types/trainers"

export default function TrainerProfile({ trainer }: {
  trainer: Trainer
}) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(trainer.is_visible ?? true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleToggleVisibility = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/auth/trainer/visibility', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !isVisible }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsVisible(!isVisible)
        setMessage({ type: 'success', text: data.message })
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al actualizar la visibilidad' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Intentá de nuevo.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-6 w-full'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Perfil de Entrenador</h2>
        <p className='text-gray-600'>
          Información de tu perfil público como entrenador
        </p>
      </div>

      {/* Visibility Toggle Section */}
      <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='font-medium text-gray-900'>Visibilidad del perfil</h3>
            <p className='text-sm text-gray-500'>
              {isVisible 
                ? 'Tu perfil es visible en las búsquedas de entrenadores' 
                : 'Tu perfil está oculto y no aparece en las búsquedas'}
            </p>
          </div>
          <button
            onClick={handleToggleVisibility}
            disabled={isLoading}
            className={clsx({
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2': true,
              'bg-indigo-600': isVisible,
              'bg-gray-200': !isVisible,
              'opacity-50 cursor-not-allowed': isLoading,
            })}
          >
            <span
              className={clsx({
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out': true,
                'translate-x-5': isVisible,
                'translate-x-0': !isVisible,
              })}
            />
          </button>
        </div>
        
        {message && (
          <div className={clsx({
            'mt-3 p-2 rounded text-sm': true,
            'bg-green-100 text-green-700': message.type === 'success',
            'bg-red-100 text-red-700': message.type === 'error',
          })}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className='pt-4 border-t border-gray-200'>
        <Info trainer={trainer} individualProfile={true}/>
      </div>
      
      <div className='pt-4 border-t border-gray-200'>
        <button
          className={clsx({
            'w-full flex items-center justify-center gap-2 py-3 px-6': true,
            'bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg': true,
            'hover:from-indigo-700 hover:to-purple-700 shadow-medium hover:shadow-large': true,
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true,
            'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]': true
          })}
          onClick={() => router.push('/soy-entrenador')}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
          </svg>
          Editar perfil
        </button>
      </div>
    </div>
  )
}
