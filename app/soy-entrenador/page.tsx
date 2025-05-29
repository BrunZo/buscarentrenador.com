'use server'

import UpdateUserForm from '../ui/forms/update_user_form';
import { redirect } from 'next/navigation';

export default async function Page() {


  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm 
        cities={[]} 
        defaultOptions={{
          prov: 'Buenos Aires', 
          city: 'Castelar',
          place: [],
          group: [],
          level: []
        }}
      />
    </div>
  )
}