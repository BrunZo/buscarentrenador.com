import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/service/auth/auth';
import { getTrainersByFilters, getTrainerEmail } from '@/service/trainers';
import AdminTrainerList from '@/app/ui/admin/trainer_list';
import type { TrainerWithEmail } from '@/types/trainers';

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user?.role !== 'admin') redirect('/');

  const pending = await getTrainersByFilters({
    places: [],
    groups: [],
    levels: [],
    require_visible: false,
    status: 'pending',
  });

  // Admins contact trainers directly, so attach each email (same pattern as the
  // individual trainer profile page).
  const trainers: TrainerWithEmail[] = await Promise.all(
    pending.map(async (trainer) => ({
      ...trainer,
      email: await getTrainerEmail(trainer.id),
    })),
  );

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
