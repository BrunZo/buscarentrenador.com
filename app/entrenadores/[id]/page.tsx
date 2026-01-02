'use server';

import Info from "@/app/ui/entrenadores/info";
import { getTrainerById } from "@/lib/trainers";
import { notFound } from "next/navigation";

export default async function Page({ params }: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params;
  const trainer = await getTrainerById(Number(id));

  if (!trainer) {
    notFound();
  }

  return (
    <div>
      <h2 className='text-2xl font-bold'>
        Perfil de entrenador
      </h2>
      <br/>
      <Info trainer={trainer} showMail={true}/>
    </div> 
  )
}