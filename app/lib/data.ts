const ENTRENADORES_PER_PAGE = 3

export type Entrenador = {
  nombre: string,
  localidad: string,
  provincia: string,
  modalidad: boolean[],
  formato: boolean[],
  niveles: boolean[],
}

export type Filters = {
  query: string
  prov: string
  loc: string
  modalidad: string
  formato: string
  nivel: string
}

const entrenadores: Entrenador[] = [
  {
    nombre: 'Bruno Martín Ziger',
    localidad: 'CABA',
    provincia: 'CABA',
    modalidad: [true, true, true],
    formato: [true, false],
    niveles: [true, true, true, true, true],
  },
  {
    nombre: 'Milagros Elizalde',
    localidad: 'La Plata',
    provincia: 'Buenos Aires',
    modalidad: [true, true, true],
    formato: [true, true],
    niveles: [true, true, true, false, false],
  },
  {
    nombre: 'Martín Lupín',
    localidad: 'Mar del Plata',
    provincia: 'Buenos Aires',
    modalidad: [true, false, false],
    formato: [true, true],
    niveles: [false, false, true, true, true],
  },
  {
    nombre: 'Julián Cabrera',
    localidad: 'Rosario',
    provincia: 'Santa Fe',
    modalidad: [true, true, true],
    formato: [true, true],
    niveles: [true, true, true],
  },
]

const filterEntrenadores = (filters: Filters) => {
  return entrenadores.filter(entrenador => {
    if (filters.query &&
      !entrenador.nombre.toLowerCase()
        .includes(filters.query.toString().toLowerCase()))
      return false
    if (filters.prov &&
      !entrenador.provincia.toLowerCase()
        .includes(filters.prov.toString().toLowerCase())) {
      return false
    }
    if (filters.loc &&
      !entrenador.localidad.toLowerCase()
        .includes(filters.loc.toString().toLowerCase()))
      return false
    if (filters.modalidad &&
      !(
        (filters.modalidad.includes('Virtual') && entrenador.modalidad[0]) ||
        (filters.modalidad.includes('A domicilio') && entrenador.modalidad[1]) ||
        (filters.modalidad.includes('En dirección') && entrenador.modalidad[2])
      )
    )
      return false
    if (filters.formato &&
      !(
        (filters.formato.includes('Individual') && entrenador.formato[0]) ||
        (filters.formato.includes('Grupal') && entrenador.formato[1])
      )
    )
      return false
    if (filters.nivel &&
      !(
        (filters.nivel.includes('Ñandú') && entrenador.niveles[0]) ||
        (filters.nivel.includes('1') && entrenador.niveles[1]) ||
        (filters.nivel.includes('2') && entrenador.niveles[2]) ||
        (filters.nivel.includes('3') && entrenador.niveles[3]) ||
        (filters.nivel.includes('Avanzado') && entrenador.niveles[4])
      )
    )
      return false
    return true
  })
}

export function fetchEntrenadoresPages(filters: Filters) {
  return Math.ceil(filterEntrenadores(filters).length / ENTRENADORES_PER_PAGE)
}

export function fetchFilteredEntrenadores(filters: Filters, page: number) {
  return filterEntrenadores(filters).slice((page - 1) * ENTRENADORES_PER_PAGE, page * ENTRENADORES_PER_PAGE)
}