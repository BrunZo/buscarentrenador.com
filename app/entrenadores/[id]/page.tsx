'use server';

import Info from "@/app/ui/entrenadores/info";
import { getTrainerById } from "@/app/utils/supabase/queries";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page({ params }: {
  params: {
    id: string
  }
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const entr = await getTrainerById(supabase, params.id)

  return (
    <div>
      <h2 className='text-2xl font-bold'>
        Perfil de entrenador
      </h2>
      <br/>
      <Info entrenador={entr}/> 
    </div>
  )
}