'use server'

import UpdateUserForm from '../ui/forms/update_user_form';

export default async function Page({ searchParams }: {
  searchParams: Promise<{
    prov?: string,
    city?: string,
  }>
}) {
  const { prov, city } = await searchParams;

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm  
        defaultOptions={{
          prov: prov || '', 
          city: city || '',
          place: [],
          group: [],
          level: []
        }}
      />
    </div>
  )
}