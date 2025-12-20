import Image from 'next/image'
import { Trainer } from '@/types/trainers'

export default function Info({ trainer }: {
  trainer: Trainer
}) {
  const image_src = '';

  return (
    <div className='flex gap-8'>
      {image_src && <div className='bg-gray-200 w-36 h-36 rounded-full'>
        <Image
          src={image_src}
          alt='Entrenador'
          width={36}
          height={36}
        />
      </div>}
      <div className='flex-1'>
        <h2 className='text-xl font-bold'>{trainer.name} {trainer.surname}</h2>
        <p className='text-gray-600 mb-3'>{trainer.city}, {trainer.province}</p>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Ubicación:</span>
            {renderChips(trainer.places, ['Virtual', 'A domicilio', 'En dirección particular'])}
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Modalidad:</span>
            {renderChips(trainer.groups, ['Individual', 'Grupal'])}
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Nivel:</span>
            {renderChips(trainer.levels, ['Ñandú', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Selectivos e internacionales'])}
          </div>
        </div>
      </div>
    </div>
  )
}

function renderChips(arr: boolean[], options: string[]) {
  const activeOptions = options.filter((_, i) => arr[i])
  
  if (activeOptions.length === 0) {
    return <span className='text-sm text-gray-400'>No especificado</span>
  }
  
  return (
    <>
      {activeOptions.map((option, i) => (
        <span
          key={i}
          className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-light bg-indigo-100 text-indigo-800'
        >
          {option}
        </span>
      ))}
    </>
  )
}
