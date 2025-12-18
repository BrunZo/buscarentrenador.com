'use server'

import Search from '@/app/ui/entrenadores/search';
import Filters from '@/app/ui/entrenadores/filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import LocationFilter from '@/app/ui/entrenadores/location_filter';
import { getAllTrainers, getTrainersByFilters } from '@/lib/trainers';
import argCities from '@/lib/arg-cities.json';

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
  const {
    query,
    city,
    prov,
    place,
    group,
    level,
    page
  } = await searchParams;
  const currentPage = Number(page || 1)
  
  const allTrainers = await getAllTrainers();
  const localidades = (argCities as any).localidades;
  const cities = localidades.map((city: any) => ({
    name: city.nombre,
    province: city.provincia.nombre
  }))

  const trainers = await getTrainersByFilters({
    query,
    city,
    prov,
    place: place ? place.split(',').map(v => v === 'true') : [false, false, false],
    group: group ? group.split(',').map(v => v === 'true') : [false, false],
    level: level ? level.split(',').map(v => v === 'true') : [false, false, false, false, false],
  })
  
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        Entrenadores
      </h1>
      <div className='flex flex-col lg:flex-row gap-4'>
        <div className='w-full lg:w-96 space-y-2 shrink-0'>
          <Search placeholder='Buscar entrenador'/>
          <LocationFilter 
            cities={cities} 
            defaultOptions={{prov: '', loc: ''}}
            replaceUrl={true}
          />
          <Filters replaceUrl={true}/>
        </div>
        <div className='w-full lg:flex-1 min-w-0'>
          <CardGrid cards={trainers.slice((currentPage - 1) * 4, currentPage * 4)}/>
          <Pagination totalPages={Math.ceil(trainers.length / 4)}/>
        </div>
      </div>
    </>
  )
}