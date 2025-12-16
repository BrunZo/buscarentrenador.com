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

  console.log(searchParams.level)
  const currentPage = Number(searchParams?.page || 1)
  //const trainers = await getTrainersByFilters(searchParams)
  
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
          <CardGrid cards={[].slice((currentPage - 1) * 4, currentPage * 4)}/>
          <Pagination totalPages={1}/>
        </div>
      </div>
    </>
  )
}