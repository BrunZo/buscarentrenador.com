import Search from "../ui/entrenadores/search";
import Filters from "../ui/entrenadores/filters";
import CardGrid from "../ui/entrenadores/card";
import Pagination from "../ui/entrenadores/pagination";

export default function Page() {
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
          <CardGrid/>
          <Pagination totalPages={10}/>
        </div>
      </div>
    </>
  )
}