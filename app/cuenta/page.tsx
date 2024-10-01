'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { createClient } from '../utils/supabase/server';
import { redirect } from 'next/navigation';
import { getTrainer } from '../utils/supabase/queries';

export default async function Page() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  const entrenador = await getTrainer(supabase)

  if (error || !data?.user)
    redirect('/login')

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
      <Dashboard user={entrenador}/>
    </div>
  );
};
