'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getTrainerByUserId } from '@/lib/trainers';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // check if the user is a trainer
  const trainer = await getTrainerByUserId(session.user.id);

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
      <Dashboard user={session.user} trainer={trainer}/>
    </div>
  );
};
