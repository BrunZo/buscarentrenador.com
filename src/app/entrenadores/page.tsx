
import Search from '@/app/ui/entrenadores/search';
import FilterGrid from '@/app/ui/entrenadores/filters/filter_grid';
import trainerFilters from '@/app/ui/entrenadores/filters/trainer_filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import LocationFilter from '@/app/ui/entrenadores/loc/location_filter';
import { getTrainersByFilters, getTrainersCount } from '@/service/trainers';
import { auth } from '@/service/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }: {
  searchParams: Promise<{
    query?: string,
    city?: string,
    prov?: string,
    place?: string,
    group?: string,
    level?: string,
    page?: string 
  }>
}) {
  const { query, city, prov, place, group, level, page } = await searchParams;

  const session = await auth.api.getSession({ headers: await headers() });
  const salt = session?.user?.id
    ?? (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? '';

  const filterParams = {
    query,
    city,
    province: prov,
    places: place ? place.split(',').map(v => v === 'true') : [false, false, false],
    groups: group ? group.split(',').map(v => v === 'true') : [false, false, false],
    levels: level ? level.split(',').map(v => v === 'true') : [false, false, false, false, false],
    require_visible: true,
    status: 'approved' as const,
  };

  let trainers;
  let totalPages;
  try {
    const totalCount = await getTrainersCount(filterParams);
    totalPages = Math.ceil(totalCount / 4) || 1;
    const currentPage = Math.min(Math.max(Number(page || 1), 1), totalPages);

    trainers = await getTrainersByFilters({
      ...filterParams,
      include_email: false,
      limit: 4,
      offset: 4 * (currentPage - 1),
      salt,
    });
  } catch (error) {
    redirect('/login');
  }

  return (
    <div className='animate-fade-in'>
      <div className='mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Entrenadores
        </h1>
        <p className='text-gray-600'>
          Encontrá a tu entrenador
        </p>
      </div>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-96 space-y-4 shrink-0'>
          <div className='bg-white rounded-xl p-5 shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-200'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
              <h2 className='text-sm font-bold text-gray-800'>Por nombre</h2>
            </div>
            <Search placeholder='Buscar entrenador'/>
          </div>
          <div className='bg-white rounded-xl p-5 shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-200'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <h2 className='text-sm font-bold text-gray-800'>Por ubicación</h2>
            </div>
            <LocationFilter
              defaultOptions={{prov: prov, city: city}}
              replaceUrl={true}
            />
          </div>
          <div className='bg-white rounded-xl p-5 shadow-soft border border-gray-100 hover:shadow-medium transition-shadow duration-200'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' />
                </svg>
              </div>
              <h2 className='text-sm font-bold text-gray-800'>Por modalidad de clase</h2>
            </div>
            <FilterGrid filters={trainerFilters} defaultStates={{}} replaceUrl={true}/>
          </div>
        </div>
        <div className='w-full lg:flex-1 min-w-0'>
          <CardGrid trainers={trainers}/>
          <Pagination totalPages={totalPages}/>
        </div>
      </div>
    </div>
  )
}
