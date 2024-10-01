'use server'

import { getCities } from '../utils/supabase/queries';
import { createClient } from '../utils/supabase/server';
import UpdateUserForm from '../ui/forms/update_user_form';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createClient()
  const { data: userData, error } = await supabase.auth.getUser()
  if (error || !userData?.user) 
    redirect('/login')

  const cities = await getCities(supabase) 
  const currTrainer = (await supabase.from('trainers').select().eq('user_id', userData.user.id).single()).data
  const currCity = (await supabase.from('cities').select().eq('id', currTrainer?.city).single()).data

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm 
        cities={cities} 
        defaultOptions={{
          prov: currCity?.province, 
          city: currCity?.name,
          place: currTrainer?.place,
          group: currTrainer?.group,
          level: currTrainer?.level
        }}
      />
    </div>
  )
}