'use server'

import Search from '@/app/ui/entrenadores/search';
import FilterGrid from '@/app/ui/entrenadores/filters/filter_grid';
import trainerFilters from '@/app/ui/entrenadores/filters/trainer_filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import LocationFilter from '@/app/ui/entrenadores/loc/location_filter';
import { getTrainersByFilters } from '@/lib/trainers';


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
  
  const currentPage = Number(page || 1)
  const trainers = await getTrainersByFilters({
    query,
    city,
    prov,
    place: place ? place.split(',').map(v => v === 'true') : [false, false, false],
    group: group ? group.split(',').map(v => v === 'true') : [false, false],
    level: level ? level.split(',').map(v => v === 'true') : [false, false, false, false, false],
  })

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
          <CardGrid trainers={trainers.slice((currentPage - 1) * 4, currentPage * 4)}/>
          <Pagination totalPages={Math.ceil(trainers.length / 4)}/>
        </div>
      </div>
    </div>
  )
}