'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react'
import {
  BuildingStorefrontIcon,
  ComputerDesktopIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Filters({ replaceUrl=false, defaultFilters }: {
  replaceUrl?: boolean
  defaultFilters?: { place: boolean[], group: boolean[], level: boolean[] }
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Filter
        name='place'
        title='Ubicación de las clases'
        options={[
          'Virtual', 'A domicilio', 'En dirección'
        ]}
        icons={[
          <ComputerDesktopIcon key={0} width={24} height={24} />,
          <HomeIcon key={1} width={24} height={24} />,
          <BuildingStorefrontIcon key={2} width={24} height={24} />
        ]}
        defaultState={defaultFilters?.place}
        replaceUrl={replaceUrl}
      />
      <Filter
        name='group'
        title='Cantidad de alumnos'
        options={[
          'Individual', 'Grupal'
        ]}
        icons={[
          <UserIcon key={0} width={24} height={24} />,
          <UserGroupIcon key={1} width={24} height={24} />
        ]}
        defaultState={defaultFilters?.group}
        replaceUrl={replaceUrl}
      />
      <Filter
        name='level'
        title='Nivel'
        options={[
          'Ñandú', '1', '2', '3', 'Avanzado'
        ]}
        defaultState={defaultFilters?.level}
        replaceUrl={replaceUrl}
      />
    </div>
  )
}

export function Filter({ icons, name, options, defaultState, replaceUrl }: {
  icons?: JSX.Element[]
  name: string
  title: string
  options: string[]
  defaultState?: boolean[]
  replaceUrl: boolean
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [selected, setSelected] = useState<boolean[]>(defaultState || options.map(() => false))

  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams)
      params.set(name, selected.join(','))
      replace(`${pathname}?${params.toString()}`)
    }
  }, [name, pathname, replace, replaceUrl, searchParams, selected])

  return (
    <div>
      <ul className='flex gap-2'>
        {options.map((option, i) => (
          <li
            key={option}
            className={`flex-1 basis-1/${options.length}`}
          >
            <Option
              icon={icons ? icons[i] : undefined}
              name={name + i.toString()}
              label={option}
              selected={selected[i]}
              handleCheck={() => {
                setSelected(selected.map((s, j) => i === j ? !s : s))
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Option({ icon, name, label, selected, handleCheck }: {
  icon?: JSX.Element
  name: string
  label: string
  selected: boolean
  handleCheck: () => void
}) {
  return (
    <>
      <input
        type='checkbox'
        name={name}
        className='hidden'
        checked={selected}
        onChange={() => {}}
      />
      <div 
        className={clsx({
          'flex flex-col items-center gap-1 w-full p-2 border rounded-md select-none': true,
          'bg-indigo-600 text-white': selected,
          'hover:bg-indigo-200': !selected,
          'text-sm': icon,
          'font-semibold': !icon
        })}
        onClick={e => {
          handleCheck()
        }}
      >
        {icon}
        {label}
      </div>
    </>
  )
}