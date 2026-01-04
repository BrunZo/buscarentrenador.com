'use server'

import UpdateUserForm from '../ui/soy-entrenador/update_user_form';
import { redirect } from 'next/navigation';
import { auth } from '@/service/auth/next-auth.config';
import { getTrainerByUserId } from '@/service/data/trainers';

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  let trainer;
  try {
    trainer = await getTrainerByUserId(session.user.id);
  } catch (error) {
    redirect('/login');
  }
  const defaultOptions = {
    prov: trainer.province || '',
    city: trainer.city || '',
    description: trainer.description || '',
    certifications: trainer.certifications && trainer.certifications.length > 0 
      ? trainer.certifications 
      : [''],
    place: trainer.places && trainer.places.length >= 3 
      ? trainer.places.slice(0, 3) 
      : [false, false, false],
    group: trainer.groups && trainer.groups.length >= 2 
      ? trainer.groups.slice(0, 2) 
      : [false, false],
    level: trainer.levels && trainer.levels.length >= 5 
      ? trainer.levels.slice(0, 5) 
      : [false, false, false, false, false]
  };

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Soy entrenador
      </h1>
      <UpdateUserForm defaultOptions={defaultOptions} />
    </div>
  )
}
