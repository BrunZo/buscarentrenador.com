'use client';

import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/error';
import LocationFilter from '@/app/ui/entrenadores/selection';
import Filters from '@/app/ui/entrenadores/filters';
import { updateUser } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [response, dispatch] = useFormState(updateUser, undefined)

  if (response?.status === 200)
    router.push('/cuenta')

  // TODO: Fetch options from API
  const options = {
    'CABA': ['CABA'],
    'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
    'Córdoba': ['Córdoba', 'Villa María', 'Río Cuarto'],
    'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela']
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <form action={dispatch} className='w-1/3 space-y-2'>
        <p>Completá tu información para registrarte como entrenador.</p>
        <LocationFilter 
          options={options} 
          // TODO: Fetch user location from API
          defaultOptions={{prov: '', loc: ''}}
        />
        <Filters defaultFilters={{
          modal: [true, true, true],
          form: [true, true],
          level: [true, true, true, true, true]
        }}/>
        <Button text='Publicar información' />
        <Message 
          type={response?.status === 200 ? 'success' : 'error'}
          msg={response?.msg}
        />
      </form>
    </div>
  )
}