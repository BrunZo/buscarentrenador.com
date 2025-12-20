'use server'

import UpdateUserForm from '../ui/soy-entrenador/update_user_form';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getTrainerByUserId } from '@/lib/trainers';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const trainer = await getTrainerByUserId(session.user.id);

  let defaultOptions = {
    prov: '',
    city: '',
    place: [false, false, false],
    group: [false, false],
    level: [false, false, false, false, false]
  }

  if (trainer) {
    defaultOptions = {
      prov: trainer.province,
      city: trainer.city,
      place: trainer.places,
      group: trainer.groups,
      level: trainer.levels
    };
  }

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm defaultOptions={defaultOptions} />
    </div>
  )
}