'use client'

import { GlobeAmericasIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import SelectionButton from '@/app/ui/entrenadores/loc/selection_button'
import { getCityOptions, getProvinceOptions } from '@/actions/locations'
import type { LocationOption } from '@/service/cities'

export default function LocationFilter({
  defaultOptions,
  replaceUrl=false,
  onProvinceChange,
  onCityChange
}: {
  defaultOptions: { provinceId?: number, cityId?: number },
  replaceUrl?: boolean,
  onProvinceChange?: (provinceId: number | null) => void,
  onCityChange?: (cityId: number | null) => void,
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [provinceId, setProvinceId] = useState<number | null>(defaultOptions.provinceId ?? null)
  const [cityId, setCityId] = useState<number | null>(defaultOptions.cityId ?? null)
  const [provinces, setProvinces] = useState<LocationOption[]>([])
  const [cities, setCities] = useState<LocationOption[]>([])

  const cityIdRef = useRef(cityId);
  useEffect(() => {
    cityIdRef.current = cityId;
  }, [cityId]);

  useEffect(() => {
    getProvinceOptions().then(setProvinces);
  }, []);

  useEffect(() => {
    if (!provinceId) {
      setCities([]);
      return;
    }

    let cancelled = false;
    getCityOptions(provinceId).then((options) => {
      if (cancelled) return;
      setCities(options);
      if (options.length === 1 && options[0].id !== cityIdRef.current) {
        setCityId(options[0].id);
        onCityChange?.(options[0].id);
      }
    });
    return () => { cancelled = true };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId]);

  const provinceName = provinces.find((p) => p.id === provinceId)?.name ?? ''
  const cityName = cities.find((c) => c.id === cityId)?.name ?? ''

  const provSelectHandler = (name: string) => {
    const option = provinces.find((p) => p.name === name);
    if (!option) return;
    if (option.id !== provinceId) {
      setCityId(null);
      onCityChange?.(null);
    }
    setProvinceId(option.id);
    onProvinceChange?.(option.id);
  }

  const citySelectHandler = (name: string) => {
    const option = cities.find((c) => c.name === name);
    if (!option) return;
    setCityId(option.id);
    onCityChange?.(option.id);
  }

  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams.toString())
      if (provinceId) params.set('provId', String(provinceId)); else params.delete('provId');
      if (cityId) params.set('cityId', String(cityId)); else params.delete('cityId');
      if (params.toString() !== searchParams.toString())
        replace(`${pathname}?${params.toString()}`)
    }
  }, [provinceId, cityId, replaceUrl, searchParams, pathname, replace])

  return (
    <div className='flex flex-col gap-2'>
      <SelectionButton
        icon={<GlobeAmericasIcon className='absolute w-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name='prov'
        placeholder='Provincia'
        selection={provinceName}
        handleSelect={provSelectHandler}
        options={provinces.map((p) => p.name)}
      />
      <SelectionButton
        icon={<MapPinIcon className='absolute w-4 h-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name='city'
        placeholder='Localidad'
        selection={cityName}
        handleSelect={citySelectHandler}
        options={cities.map((c) => c.name)}
      />
    </div>
  )
}
