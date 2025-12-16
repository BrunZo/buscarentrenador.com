'use client';

import { Trainer } from "@/lib/trainers";
import Info from "./info";

export default function CardGrid({ cards }: {
  cards: Trainer[]
}) {
  return (
    <div className='flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-md'>
      {cards.length === 0 && (
        <p className='text-gray-600'>No se encontraron entrenadores.</p>
      )}
      {cards.map((entrenador: Trainer, i) => (
        <Card key={i} entrenador={entrenador} />
      ))}
    </div>
  )
}

export function Card({ entrenador }: {
  entrenador: Trainer
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