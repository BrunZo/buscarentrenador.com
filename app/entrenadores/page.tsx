import Search from '@/app/ui/entrenadores/search';
import Filters from '@/app/ui/entrenadores/filters';
import CardGrid from '@/app/ui/entrenadores/card';
import Pagination from '@/app/ui/entrenadores/pagination';
import { fetchEntrenadoresPages, fetchFilteredEntrenadores } from '@/app/lib/data';
import LocationFilter from '@/app/ui/entrenadores/selection';

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
  const currentPage = Number(searchParams?.page || 1)
  const totalPages = await fetchEntrenadoresPages(searchParams)
  const entrenadores = await fetchFilteredEntrenadores(searchParams, currentPage)

  // TODO: Fetch data from database
  const options = {
    'CABA': ['CABA'],
    'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
    'Córdoba': ['Córdoba', 'Villa María', 'Río Cuarto'],
    'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela']
  }

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        Entrenadores
      </h1>
      <div className='flex gap-4'>
        <div className='w-96 space-y-2'>
          <Search placeholder='Buscar entrenador'/>
          <LocationFilter 
            options={options} 
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