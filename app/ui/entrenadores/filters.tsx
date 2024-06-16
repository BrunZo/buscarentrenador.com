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

export default function Filters({ replaceUrl=false }: {
  replaceUrl?: boolean
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Filter
        name='modal'
        title='Modalidad'
        options={[
          'Virtual', 'A domicilio', 'En dirección'
        ]}
        icons={[
          <ComputerDesktopIcon key={0} width={24} height={24} />,
          <HomeIcon key={1} width={24} height={24} />,
          <BuildingStorefrontIcon key={2} width={24} height={24} />
        ]}
        replaceUrl={replaceUrl}
      />
      <Filter
        name='form'
        title='Formato'
        options={[
          'Individual', 'Grupal'
        ]}
        icons={[
          <UserIcon key={0} width={24} height={24} />,
          <UserGroupIcon key={1} width={24} height={24} />
        ]}
        replaceUrl={replaceUrl}
      />
      <Filter
        name='level'
        title='Nivel'
        options={[
          'Ñandú', '1', '2', '3', 'Avanzado'
        ]}
        replaceUrl={replaceUrl}
      />
    </div>
  )
}

export function Filter({ icons, name, options, replaceUrl }: {
  icons?: JSX.Element[]
  name: string
  title: string
  options: string[]
  replaceUrl: boolean
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [selected, setSelected] = useState<boolean[]>(options.map(() => false))

  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams)
      params.set(name, selected.join(','))
      replace(`${pathname}?${params.toString()}`)
    }
  }, [selected])

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
          'bg-gray-200': selected,
          'hover:bg-gray-50': !selected,
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