import { redirect } from 'next/navigation';
import { listTrainersForAdmin } from '@/service/admin';
import AdminTrainerList from '@/app/ui/admin/trainer_list';

export default async function Page() {
  // listTrainersForAdmin runs requireAdmin first, so a non-admin (or a guest)
  // throws and gets redirected away.
  let trainers;
  try {
    trainers = await listTrainersForAdmin('pending');
  } catch (error) {
    redirect('/');
  }

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
