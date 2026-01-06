'use server';

import Info from "@/app/ui/entrenadores/info";
import { getTrainerById } from "@/service/data/trainers";
import { notFound } from 'next/navigation';

export default async function Page({ params }: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params;
  let trainer;
  try {
    trainer = await getTrainerById(Number(id));
  } catch (error) {
    notFound();
  }

  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Perfil de Entrenador
        </h1>
        <p className='text-gray-600'>
          Información detallada del entrenador
        </p>
      </div>
      <div className='bg-white rounded-2xl shadow-large border border-gray-100 p-6 md:p-8'>
        <Info trainer={trainer} individualProfile={true}/>
      </div>
    </div> 
  )
}