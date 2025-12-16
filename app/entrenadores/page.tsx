'use server'

import Search from '@/app/ui/entrenadores/search';
import Filters from '@/app/ui/entrenadores/filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import LocationFilter from '@/app/ui/entrenadores/location_filter';
import { redirect } from 'next/navigation';
import { getTrainersByFilters } from '@/lib/trainers';

export default async function Page({ searchParams }: {
  searchParams: {
    query?: string,
    city?: string,
    prov?: string,
    place?: string,
    group?: string,
    level?: string,
    page?: string 
  }
}) {
  const currentPage = Number(searchParams?.page || 1)
  
  const place = searchParams?.place 
    ? searchParams.place.split(',').map(v => v === 'true')
    : [false, false, false]
  
  const group = searchParams?.group 
    ? searchParams.group.split(',').map(v => v === 'true')
    : [false, false]
  
  const level = searchParams?.level 
    ? searchParams.level.split(',').map(v => v === 'true')
    : [false, false, false, false, false]
  
  const trainers = await getTrainersByFilters({
    query: searchParams?.query,
    city: searchParams?.city,
    prov: searchParams?.prov,
    place,
    group,
    level,
  })
  
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        Entrenadores
      </h1>
      <div className='flex gap-4'>
        <div className='w-96 space-y-2'>
          <Search placeholder='Buscar entrenador'/>
          <LocationFilter 
            cities={[]} 
            defaultOptions={{prov: '', loc: ''}}
            replaceUrl={true}
          />
          <Filters replaceUrl={true}/>
        </div>
        <div className='grow'>
          <CardGrid cards={trainers.slice((currentPage - 1) * 4, currentPage * 4)}/>
          <Pagination totalPages={1}/>
        </div>
      </div>
    </>
  )
}