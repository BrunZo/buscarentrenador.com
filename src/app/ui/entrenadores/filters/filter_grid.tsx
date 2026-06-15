'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Filter from '@/app/ui/entrenadores/filters/filter';

export interface FilterProps {
  name: string
  options: string[]
  icons?: React.ReactNode[]
}

export default function FilterGrid({ 
  filters, 
  defaultStates, 
  replaceUrl=false,
  onPlaceChange,
  onGroupChange,
  onLevelChange
}: {
  filters: FilterProps[]
  defaultStates: Record<string, boolean[]>,
  replaceUrl: boolean,
  onPlaceChange?: (selected: boolean[]) => void,
  onGroupChange?: (selected: boolean[]) => void,
  onLevelChange?: (selected: boolean[]) => void,
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  if (!defaultStates)
    defaultStates = {}

  for (const filter of filters) {
    if (!defaultStates?.[filter.name]) {
      const defaultValue = searchParams.get(filter.name)
      if (defaultValue)
        defaultStates[filter.name] = defaultValue.split(',').map(v => v === 'true')
    }
  }

  const handleSelection = async (name: string, selected: boolean[]) => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams.toString())
      if (selected.some(v => v === true))
        params.set(name, selected.join(','))
      else
        params.delete(name)
      if (params.toString() !== searchParams.toString())
        replace(`${pathname}?${params.toString()}`)
    }
    
    // Call the appropriate onChange callback
    if (name === 'place' && onPlaceChange) {
      onPlaceChange(selected)
    } else if (name === 'group' && onGroupChange) {
      onGroupChange(selected)
    } else if (name === 'level' && onLevelChange) {
      onLevelChange(selected)
    }
  }

  return (
    <div className='flex flex-col md:gap-4 gap-2'>
      {filters.map((filter) => (
        <div key={filter.name} className="w-full">
          <Filter
            name={filter.name}
            options={filter.options}
            icons={filter.icons}
            defaultState={defaultStates?.[filter.name]}
            handleSelection={(selected: boolean[]) => handleSelection(filter.name, selected)}
          />
        </div>
      ))}
    </div>
  )
}
