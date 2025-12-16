import { Trainer } from "@/lib/trainers";
import Image from 'next/image'

export default function Info({ entrenador }: {
  entrenador: Trainer
}) {
  return (
    <div className='flex gap-8'>
      {/*<div className='bg-gray-200 w-36 h-36 rounded-full'>
        <Image
          src='/images/entrenador.jpg'
          alt='Entrenador'
          width={36}
          height={36}
        />
      </div>*/}
      <div className='flex-1'>
        <h2 className='text-xl font-bold'>{entrenador.name} {entrenador.surname}</h2>
        <p className='text-gray-600 mb-3'>{entrenador.city}, {entrenador.province}</p>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Ubicación:</span>
            {renderChips(entrenador.places, ['Virtual', 'A domicilio', 'En dirección particular'])}
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Modalidad:</span>
            {renderChips(entrenador.groups, ['Individual', 'Grupal'])}
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600'>Nivel:</span>
            {renderChips(entrenador.levels, ['Ñandú', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Selectivos e internacionales'])}
          </div>
        </div>
      </div>
    </div>
  )
}

function renderChips(arr: boolean[] | string[] | undefined, options: string[]) {
  // Convert to boolean array if needed
  const boolArray: boolean[] = Array.isArray(arr) 
    ? arr.map((item: any) => typeof item === 'boolean' ? item : item === true || item === 'true' || item === '1')
    : [];
  
  const activeOptions = options.filter((_, i) => boolArray?.at(i))
  
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
