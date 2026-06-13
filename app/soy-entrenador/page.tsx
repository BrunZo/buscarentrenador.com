'use server'

import UpdateUserForm from '../ui/soy-entrenador/update_user_form';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/service/auth/auth';
import { getTrainerByUserId } from '@/service/trainers';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect('/login');
  }

  const trainer = await getTrainerByUserId(session.user.id).catch(() => null);

  const defaultOptions = {
    prov: trainer?.province || '',
    city: trainer?.city || '',
    description: trainer?.description || '',
    certifications: trainer?.certifications && trainer?.certifications.length > 0 
      ? trainer?.certifications 
      : [''],
    places: trainer?.places && trainer?.places.length >= 3 
      ? trainer?.places.slice(0, 3) 
      : [false, false, false],
    groups: trainer?.groups && trainer?.groups.length >= 3
      ? trainer?.groups.slice(0, 3)
      : [trainer?.groups?.[0] ?? false, trainer?.groups?.[1] ?? false, trainer?.groups?.[2] ?? false],
    levels: trainer?.levels && trainer?.levels.length >= 5
      ? trainer?.levels.slice(0, 5)
      : [false, false, false, false, false],
    soy_exo: trainer?.soy_exo ?? false,
    examenes_oma: trainer?.examenes_oma ?? false,
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
