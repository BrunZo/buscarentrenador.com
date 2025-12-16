'use server'

import { Suspense } from 'react';
import UpdateUserForm from '../ui/forms/update_user_form';

export default async function Page() {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <Suspense>
        <UpdateUserForm 
          cities={[]} 
          defaultOptions={{
            prov: '', 
            city: '',
            place: [],
            group: [],
            level: []
          }}
        />
      </Suspense>
    </div>
  )
}