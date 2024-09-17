import Search from '@/app/ui/entrenadores/search';
import Filters from '@/app/ui/entrenadores/filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import { fetchEntrenadoresPages, fetchFilteredEntrenadores } from '@/app/lib/data';
import LocationFilter from '@/app/ui/entrenadores/location_filter';
import { createClient } from  '@/app/utils/supabase/client';
import { getCities } from '../utils/supabase/queries';
import { cookies } from 'next/headers';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query?: string
    page?: string
    prov?: string
    loc?: string
    modal?: string
    form?: string
    level?: string
  }
}) {
  // const cookieStore = cookies()
  const supabase = createClient()

  const cities = await getCities(supabase)
  
  const currentPage = Number(searchParams?.page || 1)
  const totalPages = await fetchEntrenadoresPages(searchParams)
  const entrenadores = await fetchFilteredEntrenadores(searchParams, currentPage)
  
  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        Entrenadores
      </h1>
      <div className='flex gap-4'>
        <div className='w-96 space-y-2'>
          <Search placeholder='Buscar entrenador'/>
          <LocationFilter 
            cities={cities} 
            defaultOptions={{prov: '', loc: ''}}
            replaceUrl={true}
          />
          <Filters replaceUrl={true}/>
        </div>
        <div className='grow'>
          <CardGrid cards={entrenadores}/>
          <Pagination totalPages={totalPages}/>
        </div>
      </div>
    </>
  )
}