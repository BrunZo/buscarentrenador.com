const ENTRENADORES_PER_PAGE = 3

// mergear con user
export type Entrenador = {
  name: string,
  loc: string,
  prov: string,
  mod: boolean[],
  form: boolean[],
  level: boolean[],
}

export type Filters = {
  query?: string
  prov?: string
  loc?: string
  mod?: string
  form?: string
  level?: string
}

// cambiar a db
const entrenadores: Entrenador[] = [
  {
    name: 'Bruno Martín Ziger',
    loc: 'CABA',
    prov: 'CABA',
    mod: [true, true, true],
    form: [true, false],
    level: [true, true, true, true, true],
  },
  {
    name: 'Milagros Elizalde',
    loc: 'La Plata',
    prov: 'Buenos Aires',
    mod: [true, true, true],
    form: [true, true],
    level: [true, true, true, false, false],
  },
  {
    name: 'Martín Lupín',
    loc: 'Mar del Plata',
    prov: 'Buenos Aires',
    mod: [true, false, false],
    form: [true, true],
    level: [false, false, true, true, true],
  },
  {
    name: 'Julián Cabrera',
    loc: 'Rosario',
    prov: 'Santa Fe',
    mod: [true, true, true],
    form: [true, true],
    level: [true, true, true, true, true],
  },
]

const filterEntrenadores = (filters: Filters) => {
  // simplificar?? una función que chequee un filtro

  return entrenadores.filter(entrenador => {
    if (filters.query &&
      !entrenador.name.toLowerCase()
        .includes(filters.query.toString().toLowerCase())) return false
    
    if (filters.prov &&
      !entrenador.prov.toLowerCase()
        .includes(filters.prov.toString().toLowerCase())) return false
    
    if (filters.loc &&
      !entrenador.loc.toLowerCase()
        .includes(filters.loc.toString().toLowerCase())) return false
    
    if (filters.mod && 
      filters.mod.split(',').some((modal) => modal === 'true') &&
      !filters.mod.split(',').some((modal, i) => modal === 'true' && entrenador.mod[i])) {
      return false
    }
    
    if (filters.form &&
      filters.form.split(',').some((form) => form === 'true') &&
      !filters.form.split(',').some((form, i) => form === 'true' && entrenador.form[i]))
      return false
    
    if (filters.level &&
      filters.level.split(',').some((level) => level === 'true') &&
      !filters.level.split(',').some((level, i) => level === 'true' && entrenador.level[i])) return false
    
    return true
  })
}

export function fetchEntrenadoresPages(filters: Filters) {
  return Math.ceil(filterEntrenadores(filters).length / ENTRENADORES_PER_PAGE)
}

export function fetchFilteredEntrenadores(filters: Filters, page: number) {
  return filterEntrenadores(filters)
    .slice((page - 1) * ENTRENADORES_PER_PAGE, page * ENTRENADORES_PER_PAGE)
}