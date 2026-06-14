
import Dashboard from '@/app/ui/cuenta/dashboard';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/service/auth/auth';
import { getTrainerByUserId } from '@/service/trainers';
import { userHasPasswordAccount } from '@/service/users';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/login');
  }

  // trainer will be null if the user is not a trainer
  const trainerData = await getTrainerByUserId(session.user.id).catch(() => null);
  const trainer = trainerData ? { ...trainerData, email: session.user.email } : null;

  const hasPassword = await userHasPasswordAccount(session.user.id);

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
      <Dashboard user={session.user} trainer={trainer} hasPassword={hasPassword}/>
    </div>
  );
};
