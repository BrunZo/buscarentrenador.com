'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { redirect } from 'next/navigation';

export default async function Page() {

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
      <Dashboard user={{
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
  );
};
