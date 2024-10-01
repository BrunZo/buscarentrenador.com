'use client'

import { GlobeAmericasIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SelectionButton from './selection_button'

export default function LocationFilter({ 
  cities, 
  defaultOptions,
  replaceUrl=false
}: {
  cities: { name: string, province: string }[],
  defaultOptions?: { [key: string]: string },
  replaceUrl?: boolean
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [provSelection, setProvSelection] = useState(defaultOptions?.prov || searchParams.get('prov') || '')
  const [citySelection, setCitySelection] = useState(defaultOptions?.city || searchParams.get('city') || '')

  const provinces = cities
    .map(city => city.province)
    .filter((prov, i, arr) => arr.indexOf(prov) === i)

  const citiesFromProv = (prov: string) => cities
    .filter(city => city.province === prov)
    .map(city => city.name)

  // TODO: Add this functionality to the handleSelect through a separate function
  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams)
      params.set('prov', provSelection);
      params.set('city', citySelection);
      replace(`${pathname}?${params.toString()}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provSelection, citySelection])

  const provSelectHandler = (prov: string) => {
    if (prov !== provSelection)
      setCitySelection('')
    setProvSelection(prov)
    
    const posCities = citiesFromProv(prov)
    if (posCities.length === 1)
      setCitySelection(posCities[0])
  }

  return (
    <div className='flex flex-col gap-2'>
      <SelectionButton
        icon={<GlobeAmericasIcon className='absolute w-4 w-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name='prov'
        placeholder='Provincia'
        selection={provSelection}
        handleSelect={provSelectHandler}
        options={provinces}
      />
      <SelectionButton
        icon={<MapPinIcon className='absolute w-4 h-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name='city'
        placeholder='Localidad'
        selection={citySelection}
        handleSelect={setCitySelection}
        options={citiesFromProv(provSelection)}
      />
    </div>
  )
}