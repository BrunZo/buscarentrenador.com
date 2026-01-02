'use client'

import { User } from "next-auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AccountInfo({ user }: {
  user: User
}) {
  const router = useRouter()
  const { update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la información')
      }

      setSuccess(data.message)
      setIsEditing(false)
      
      // Update the session with new data
      await update({
        name: formData.name,
        surname: formData.surname
      })
      
      // Refresh the page to update the UI
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      surname: user.surname || ''
    })
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className='space-y-6 w-full'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Mi Cuenta</h2>
          <p className='text-gray-600'>
            Información personal de tu cuenta
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium'
          >
            Editar
          </button>
        )}
      </div>

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-800 text-sm'>{error}</p>
        </div>
      )}

      {success && (
        <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
          <p className='text-green-800 text-sm'>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='space-y-4 pt-4 border-t border-gray-200'>
        <div className='flex items-start gap-4 p-4 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100'>
          <div className='w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Correo electrónico</div>
            <div className='text-base font-semibold text-gray-900'>{user.email}</div>
          </div>
        </div>
        
        <div className='flex items-start gap-4 p-4 bg-linear-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100'>
          <div className='w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Nombre</div>
            {isEditing ? (
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
                disabled={isLoading}
              />
            ) : (
              <div className='text-base font-semibold text-gray-900'>{user.name || 'No especificado'}</div>
            )}
          </div>
        </div>
        
        <div className='flex items-start gap-4 p-4 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100'>
          <div className='w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Apellido</div>
            {isEditing ? (
              <input
                type='text'
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                required
                disabled={isLoading}
              />
            ) : (
              <div className='text-base font-semibold text-gray-900'>{user.surname || 'No especificado'}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
              type='button'
              onClick={handleCancel}
              disabled={isLoading}
              className='flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
