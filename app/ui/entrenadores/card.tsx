'use client';

import { Entrenador, fetchFilteredEntrenadores } from "@/app/lib/data";
import { useSearchParams } from "next/navigation";

export default function CardGrid({ currentPage }: {
  currentPage: number
}) {
  const searchParams = useSearchParams();
  const entrenadores: Entrenador[] = fetchFilteredEntrenadores({
    query: searchParams.get('query') || '',
    prov: searchParams.get('prov') || '',
    loc: searchParams.get('loc') || '',
    modalidad: searchParams.get('modalidad') || '',
    formato: searchParams.get('formato') || '',
    nivel: searchParams.get('nivel') || ''
  }, currentPage)

  return (
    <div className='flex flex-col gap-4 p-4 mb-4 border border-gray-200 rounded-md'>
      {entrenadores.map((entrenador: Entrenador) => (
        <Card key={entrenador.nombre} {...entrenador} />
      ))}
    </div>
  )
}

export function Card({ nombre, localidad, provincia, modalidad, formato, niveles }: Entrenador) {
  return (
    <div className='flex gap-4 p-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'>
      <div className='w-16 h-16 bg-gray-200 rounded-full' />
      <div>
        <h2 className='text-xl font-bold'>{nombre}</h2>
        <p className='text-gray-600 mb-1'>{localidad}, {provincia}</p>
        {/*<p>
          <span className='font-bold'>Virtual</span>,&nbsp;
          <span className='font-bold'>a domicilio</span> y&nbsp;
          <span className='font-bold'>en dirección particular</span>.
        </p>
        <p>
          <span className='font-bold'>Individual</span> y&nbsp;
          <span className='font-bold'>grupal</span>.
        </p>
        <p>
          <span className='font-bold'>Ñandú</span>,&nbsp;
          <span className='font-bold'>niveles 1, 2 y 3</span> y&nbsp;
          <span className='font-bold'>para selectivos/internacionales</span>.
        </p>*/}
      </div>
    </div>
  )
}