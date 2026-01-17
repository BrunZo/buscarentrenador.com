'use client'

import { GlobeAmericasIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SelectionButton from '@/app/ui/entrenadores/loc/selection_button'
import getCities from '@/service/loc/cities';

export default function LocationFilter({
  defaultOptions,
  replaceUrl=false,
  onProvinceChange,
  onCityChange
}: {
  defaultOptions: { prov?: string, city?: string },
  replaceUrl?: boolean,
  onProvinceChange?: (prov: string) => void,
  onCityChange?: (city: string) => void,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [provSelection, setProvSelection] = useState(defaultOptions.prov || '')
  const [citySelection, setCitySelection] = useState(defaultOptions.city || '')
  
  const cities = getCities();
  const provinces = cities
    .map(city => city.prov)
    .filter((prov, i, arr) => arr.indexOf(prov) === i)
    .sort()

  const citiesFromProv = (prov: string) => cities
    .filter(city => city.prov === prov)
    .map(city => city.name)
    .sort()

  const provSelectHandler = (prov: string) => {
    if (prov !== provSelection)
      setCitySelection('')
    setProvSelection(prov)
    onProvinceChange?.(prov)
    
    const posCities = citiesFromProv(prov)
    if (posCities.length === 1) {
      setCitySelection(posCities[0])
      onCityChange?.(posCities[0])
    }
  }

  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('prov', provSelection);
      params.set('city', citySelection);
      if (params.toString() !== searchParams.toString())
        replace(`${pathname}?${params.toString()}`)
    }
  }, [provSelection, citySelection, replaceUrl, searchParams, pathname, replace])

  return (
    <div className='flex flex-col gap-2'>
      <SelectionButton
        icon={<GlobeAmericasIcon className='absolute w-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
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
        handleSelect={(city) => {
          setCitySelection(city)
          onCityChange?.(city)
        }}
        options={citiesFromProv(provSelection)}
      />
    </div>
  )
}
