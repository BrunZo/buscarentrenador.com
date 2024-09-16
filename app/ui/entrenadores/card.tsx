'use client';

import { Entrenador } from '@/app/lib/definitions';

export default function CardGrid({ cards }: {
  cards: Entrenador[]
}) {
  return (
    <div className='flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-md'>
      {cards.length === 0 && (
        <p className='text-gray-600'>No se encontraron entrenadores.</p>
      )}
      {cards.map((entrenador: Entrenador) => (
        <Card key={entrenador.name} {...entrenador} />
      ))}
    </div>
  )
}

export function Card(entrenador: Entrenador) {
  const formParagraph = (arr: string[], options: string[]) => {
    const text = options.filter((_, i) => arr?.at(i) === 'on')
    console.log(text)
    return (
      <p>
        {text.map((t, i) => (
          <span key={t} className='font-semibold'>
            {i === 0 ? t.charAt(0).toUpperCase() + t.slice(1) : t}
            {i < text.length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
    )
  }

  return (
    <div className='flex gap-4 p-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'>
      <div className='w-16 h-16 bg-gray-200 rounded-full' />
      <div>
        <h2 className='text-xl font-bold'>{entrenador.name}</h2>
        <p className='text-gray-600 mb-1'>{entrenador.loc}, {entrenador.prov}</p>
        {formParagraph(entrenador.mod?.split(','), ['virtual', 'a domicilio', 'en dirección particular'])}
        {formParagraph(entrenador.form?.split(','), ['individual', 'grupal'])}
        {formParagraph(entrenador.level?.split(','), ['ñandú', 'nivel 1', 'nivel 2', 'nivel 3', 'para selectivos/internacionales'])}
      </div>
    </div>
  )
}