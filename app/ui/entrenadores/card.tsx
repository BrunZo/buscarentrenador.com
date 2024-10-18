'use client';

import Info from "./info";

export type Entrenador = {
  id: string
  name: string
  surname: string
  city: string
  province: string
  place: boolean[]
  group: boolean[]
  level: boolean[]
}

export default function CardGrid({ cards }: {
  cards: Entrenador[]
}) {
  return (
    <div className='flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-md'>
      {cards.length === 0 && (
        <p className='text-gray-600'>No se encontraron entrenadores.</p>
      )}
      {cards.map((entrenador: Entrenador, i) => (
        <Card key={i} entrenador={entrenador} />
      ))}
    </div>
  )
}

export function Card({ entrenador }: {
  entrenador: Entrenador
}) {
  return (
    <div 
      className='flex gap-4 p-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'
      onClick={() => window.location.href = `/entrenadores/${entrenador.id}`}
    >
      <Info entrenador={entrenador}/>
    </div>
  )
}