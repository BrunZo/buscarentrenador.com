'use client';

import { Trainer } from "@/lib/trainers";
import Info from "./info";

export type Entrenador = {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  city: string;
  province: string;
  description: string;
  hourly_rate: number;
  certifications: string[];
  created_at: Date;
  updated_at: Date;
  place: boolean[];
  group: boolean[];
  level: boolean[];
};

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
  // Convert Trainer to Entrenador format
  // Note: places, groups, levels come from DB as boolean[] but TypeScript types them as string[]
  // We need to convert them properly
  const { places, groups, levels, ...rest } = entrenador;
  const entrenadorAdapted: Entrenador = {
    ...rest,
    place: Array.isArray(places) 
      ? places.map((p: any) => typeof p === 'boolean' ? p : p === true || p === 'true' || p === '1') 
      : [],
    group: Array.isArray(groups) 
      ? groups.map((g: any) => typeof g === 'boolean' ? g : g === true || g === 'true' || g === '1') 
      : [],
    level: Array.isArray(levels) 
      ? levels.map((l: any) => typeof l === 'boolean' ? l : l === true || l === 'true' || l === '1') 
      : [],
  };
  
  return (
    <div 
      className='flex gap-4 p-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'
      onClick={() => window.location.href = `/entrenadores/${entrenador.id}`}
    >
      <Info entrenador={entrenadorAdapted}/>
    </div>
  )
}