'use client';

import { useRouter } from 'next/navigation';
import Info from '@/app/ui/entrenadores/info'
import { Trainer } from '@/types/trainers'

export default function CardGrid({ trainers }: {
  trainers: Trainer[]
}) {
  return (
    <div className='flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-md'>
      {trainers.length === 0 && (
        <p className='text-gray-600'>No se encontraron entrenadores.</p>
      )}
      {trainers.map((trainer: Trainer, i) => (
        <Card key={i} trainer={trainer} />
      ))}
    </div>
  )
}

export function Card({ trainer }: {
  trainer: Trainer
}) {
  const router = useRouter();
  return (
    <div 
      className='flex gap-4 p-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'
      onClick={() => router.push(`/entrenadores/${trainer.id}`)}
    >
      <Info trainer={trainer} showMail={false}/>
    </div>
  )
}