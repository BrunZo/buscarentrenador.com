'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
      <Dashboard user={{
        id: session.user.id,
        name: session.user.name || '',
        surname: session.user.surname || '',
        city: 'Castelar',
        province: 'Buenos Aires',
        group: [],
        level: [],
        place: [],
      }}/>
    </div>
  );
};
