'use client'

import clsx from 'clsx'
import { useState } from 'react'
import Info from '@/app/ui/entrenadores/info'
import type { TrainerWithEmail } from '@/types/trainers'
import { decideTrainer } from '@/actions/admin'

export default function AdminTrainerList({ trainers }: {
  trainers: TrainerWithEmail[]
}) {
  const [pending, setPending] = useState(trainers)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleDecision = async (id: number, status: 'approved' | 'rejected') => {
    setLoadingId(id)
    setMessage(null)

    try {
      const result = await decideTrainer({ id, status })

      if (result.ok) {
        setPending((prev) => prev.filter((t) => t.id !== id))
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión. Intentá de nuevo.' })
    } finally {
      setLoadingId(null)
    }
  }

  if (pending.length === 0) {
    return (
      <div className='p-6 bg-gray-50 rounded-lg border border-gray-200 text-gray-600'>
        No hay entrenadores pendientes de aprobación.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {message && (
        <div className={clsx({
          'p-3 rounded text-sm': true,
          'bg-green-100 text-green-700': message.type === 'success',
          'bg-red-100 text-red-700': message.type === 'error',
        })}>
          {message.text}
        </div>
      )}

      {pending.map((trainer) => (
        <div
          key={trainer.id}
          className='bg-white rounded-2xl shadow-large border border-gray-100 p-6 md:p-8 space-y-6'
        >
          <Info trainer={trainer} individualProfile={true} />

          <div className='flex gap-3 pt-4 border-t border-gray-200'>
            <button
              onClick={() => handleDecision(trainer.id, 'approved')}
              disabled={loadingId === trainer.id}
              className={clsx({
                'flex-1 py-3 px-6 font-semibold rounded-lg text-white transition-all duration-200': true,
                'bg-green-600 hover:bg-green-700': true,
                'opacity-50 cursor-not-allowed': loadingId === trainer.id,
              })}
            >
              Aprobar
            </button>
            <button
              onClick={() => handleDecision(trainer.id, 'rejected')}
              disabled={loadingId === trainer.id}
              className={clsx({
                'flex-1 py-3 px-6 font-semibold rounded-lg text-white transition-all duration-200': true,
                'bg-red-600 hover:bg-red-700': true,
                'opacity-50 cursor-not-allowed': loadingId === trainer.id,
              })}
            >
              Rechazar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
