'use client';

import { useRouter } from 'next/navigation';
import Info from '@/app/ui/entrenadores/info'
import { TrainerWithUser } from '@/service/db/schema'

export default function CardGrid({ trainers }: {
  trainers: TrainerWithUser[]
}) {
  return (
    <div className='flex flex-col gap-4 mb-4'>
      {trainers.length === 0 && (
        <div className='bg-white rounded-xl p-8 text-center shadow-soft border border-gray-100'>
          <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          <p className='text-gray-600 text-lg'>No se encontraron entrenadores.</p>
          <p className='text-gray-500 text-sm mt-2'>Intentá ajustar los filtros de búsqueda</p>
        </div>
      )}
      {trainers.map((trainer: TrainerWithUser, i) => (
        <Card key={i} trainer={trainer} />
      ))}
    </div>
  )
}

export function Card({ trainer }: {
  trainer: TrainerWithUser
}) {
  const router = useRouter();
  return (
    <div 
      className='bg-white rounded-xl p-6 border border-gray-100 shadow-soft hover:shadow-medium hover:-translate-y-1 transition-all duration-300 cursor-pointer group'
      onClick={() => router.push(`/entrenadores/${trainer.id}`)}
    >
      <div className='flex items-center gap-4'>
        <div className='flex-1 min-w-0'>
          <Info trainer={trainer} individualProfile={false}/>
        </div>
        <div className='shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <svg className='w-6 h-6 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>
      </div>
    </div>
  )
}