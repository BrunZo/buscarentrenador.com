import Search from "@/app/ui/entrenadores/search";
import Filters from "@/app/ui/entrenadores/filters";
import CardGrid from "@/app/ui/entrenadores/card";
import Pagination from "@/app/ui/entrenadores/pagination";
import { fetchEntrenadoresPages } from "../lib/data";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
    prov?: string
    loc?: string
    modalidad?: string
    formato?: string
    nivel?: string
  }
}) {
  const currentPage = Number(searchParams?.page || 1)
  const totalPages = fetchEntrenadoresPages({
    query: searchParams?.query || '',
    prov: searchParams?.prov || '',
    loc: searchParams?.loc || '',
    modalidad: searchParams?.modalidad || '',
    formato: searchParams?.formato || '',
    nivel: searchParams?.nivel || ''
  })

  return (
    <>
      <h1 className='text-2xl font-bold mb-4'>
        Entrenadores
      </h1>
      <div className='flex gap-4'>
        <div className='w-96'>
          <Search placeholder="Buscar entrenador"/>
          <Filters/>
        </div>
        <div className='grow'>
          <CardGrid currentPage={currentPage}/>
          <Pagination totalPages={totalPages}/>
        </div>
      </div>
    </>
  )
}