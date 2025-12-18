'use server'

import { Suspense } from 'react';
import UpdateUserForm from '../ui/forms/update_user_form';
import argCities from '@/lib/arg-cities.json';

export default async function Page() {
  const localidades = (argCities as any).localidades;
  const cities = localidades.map((city: any) => ({
    name: city.nombre,
    province: city.provincia.nombre
  }));

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <Suspense>
        <UpdateUserForm 
          cities={cities} 
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