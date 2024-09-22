import { getCities } from '../utils/supabase/queries';
import { createClient } from '../utils/supabase/server';
import UpdateUserForm from '../ui/forms/update_user_form';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const cities = await getCities(supabase) 

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm cities={cities} defaultOptions={{ prov: '', city: '' }}/>
    </div>
  )
}