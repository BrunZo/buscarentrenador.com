'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { redirect } from 'next/navigation';
import { auth } from '@/service/auth/next-auth.config';
import { getTrainerByUserId } from '@/data/trainers';

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  // trainer will be null if the user is not a trainer
  const trainer = await getTrainerByUserId(session.user.id).catch(() => null);

  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Mi Cuenta
        </h1>
        <p className='text-gray-600'>
          Gestioná tu información personal y perfil de entrenador
        </p>
      </div>
      <Dashboard user={session.user} trainer={trainer}/>
    </div>
  );
};
