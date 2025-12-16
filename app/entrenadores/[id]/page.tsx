'use server';

import Info from "@/app/ui/entrenadores/info";
import { redirect } from "next/navigation";

export default async function Page({ params }: {
  params: {
    id: string
  }
}) {

  return (
    <div>
      <h2 className='text-2xl font-bold'>
        Perfil de entrenador
      </h2>
      <br/>
      <Info entrenador={{
        id: '1',
        name: 'Juan',
        surname: 'Perez',
        city: 'Castelar',
        province: 'Buenos Aires',
        group: [],
        level: [],
        place: [],
      }}/> 
    </div>
  )
}