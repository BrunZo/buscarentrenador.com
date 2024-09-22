import Search from '@/app/ui/entrenadores/search';
import Filters from '@/app/ui/entrenadores/filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import LocationFilter from '@/app/ui/entrenadores/location_filter';
import { fetchEntrenadoresPages, fetchFilteredEntrenadores } from '@/app/lib/data';
import { createClient } from  '@/app/utils/supabase/server';
import { getCities } from '@/app/utils/supabase/queries';
import { redirect } from 'next/navigation';
import { FiltersType } from '@/app/lib/data';

export default async function Page({ searchParams }: {
  searchParams: FiltersType & { page?: string }
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

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