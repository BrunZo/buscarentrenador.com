import { sql } from "@vercel/postgres"
import { Entrenador } from "./definitions"

const ENTRENADORES_PER_PAGE = 3

export type Filters = {
  query?: string
  prov?: string
  loc?: string
  mod?: string
  form?: string
  level?: string
}

const filterEntrenadores = (entrenadores: Entrenador[], filters: Filters) => {
  return entrenadores.filter(entrenador => {

    console.log(entrenador, filters)

    if (filters.query && !entrenador.name.toLowerCase()
        .includes(filters.query.toString().toLowerCase())) return false
    
    if (filters.prov && !entrenador.prov.toLowerCase()
        .includes(filters.prov.toString().toLowerCase())) return false
    
    if (filters.loc && !entrenador.loc.toLowerCase()
        .includes(filters.loc.toString().toLowerCase())) return false
    
    if (filters.mod && 
        filters.mod.split(',').some((modal) => modal === 'true') &&
        !filters.mod.split(',').some((modal, i) => modal === 'true' && entrenador.mod.split(',')[i] === 'on')) {
      return false
    }
    
    if (filters.form &&
        filters.form.split(',').some((form) => form === 'true') &&
        !filters.form.split(',').some((form, i) => form === 'true' && entrenador.form.split(',')[i] === 'on'))
      return false
    
    if (filters.level &&
        filters.level.split(',').some((level) => level === 'true') &&
        !filters.level.split(',').some((level, i) => level === 'true' && entrenador.level.split(',')[i] === 'on'))
      return false
    
    return true
  })
}

export async function fetchEntrenadoresPages(filters: Filters) {
  // optimizar y agregar el filtro acá
  const entrenadores = await sql<Entrenador>`SELECT * from users WHERE entr=${true}`
  return Math.ceil(filterEntrenadores(entrenadores.rows, filters).length / ENTRENADORES_PER_PAGE)
}

export async function fetchFilteredEntrenadores(filters: Filters, page: number) {
  // optimizar y agregar el filtro acá
  const entrenadores = await sql<Entrenador>`SELECT * FROM users WHERE entr=${true}`
  return filterEntrenadores(entrenadores.rows, filters)
    .slice((page - 1) * ENTRENADORES_PER_PAGE, page * ENTRENADORES_PER_PAGE)
}