import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/service/auth/auth';
import { getTrainersByFilters } from '@/service/trainers';
import AdminTrainerList from '@/app/ui/admin/trainer_list';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.role !== 'admin') redirect('/');

  // Admins contact trainers directly, so include_email pulls the email in the
  // same query instead of one lookup per trainer.
  const trainers = await getTrainersByFilters({
    places: [],
    groups: [],
    levels: [],
    require_visible: false,
    status: 'pending',
    include_email: true,
  });

  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Panel de administración
        </h1>
        <p className='text-gray-600'>
          Entrenadores pendientes de aprobación
        </p>
      </div>
      <AdminTrainerList trainers={trainers} />
    </div>
  );
};
