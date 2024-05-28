"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react"
import {
  BuildingStorefrontIcon,
  ComputerDesktopIcon,
  GlobeAmericasIcon,
  HomeIcon,
  MapPinIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
  return (
    <div className='flex flex-col gap-4 mb-1'>
      <LocationFilter />
      <Filter
        title='Modalidad'
        options={[
          'Virtual', 'A domicilio', 'En dirección'
        ]}
        icons={[
          <ComputerDesktopIcon key={0} width={24} height={24} />,
          <HomeIcon key={1} width={24} height={24} />,
          <BuildingStorefrontIcon key={2} width={24} height={24} />
        ]}
      />
      <Filter
        title='Formato'
        options={[
          'Individual', 'Grupal'
        ]}
        icons={[
          <UserIcon key={0} width={24} height={24} />,
          <UserGroupIcon key={1} width={24} height={24} />
        ]}
      />
      <Filter
        title='Nivel'
        options={[
          'Ñandú', '1', '2', '3', 'Avanzado'
        ]}
      />
    </div>
  )
}

export function LocationFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const options: { [key: string]: string[] } = {
    'CABA': ['CABA'],
    'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
    'Córdoba': ['Córdoba', 'Villa María', 'Río Cuarto'],
    'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela']
  }
  
  const [provSelection, setProvSelection] = useState(searchParams.get('prov') || '')
  const [locSelection, setLocSelection] = useState(searchParams.get('loc') || '')

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (provSelection) {
      params.set('prov', provSelection);
    } else {
      params.delete('prov');
    }
    if (locSelection) {
      params.set('loc', locSelection);
    } else {
      params.delete('loc');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [provSelection, locSelection])

  return (
    <div>
      {/* <h2 className='text-lg font-bold'>Ubicación</h2> */}
      <div className='flex flex-col gap-2'>
        <SelectionButton
          icon={
            <GlobeAmericasIcon
              className='absolute z-10 left-3 top-1/2 transform -translate-y-1/2'
              width={16}
              height={16}
            />
          }
          placeholder='Provincia'
          selection={provSelection}
          select={(option) => {
            if (option !== provSelection)
              setLocSelection('')
            setProvSelection(option)
            if (options[option] && options[option].length === 1)
              setLocSelection(options[option][0])
          }}
          options={Object.keys(options)}
        />
        <SelectionButton
          icon={
            <MapPinIcon
              className='absolute z-10 left-3 top-1/2 transform -translate-y-1/2'
              width={16}
              height={16}
            />
          }
          placeholder='Localidad'
          selection={locSelection}
          select={(option) => {
            setLocSelection(option)
          }}
          options={provSelection ? options[provSelection] : []}
        />
      </div>
    </div>
  )
}

export function SelectionButton({ icon, placeholder, selection, select, options }: {
  icon?: JSX.Element,
  placeholder: string,
  selection: string,
  select: (option: string) => void,
  options: string[]
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('')

  const handleSearch = useDebouncedCallback((term: string) => setFilter(term))

  const buttonRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.value = selection
      if (menuOpen)
        buttonRef.current.focus()
      else 
        buttonRef.current.blur()
    }
  }, [menuOpen, selection])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
          menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
  }, [menuRef, buttonRef, selection])
  
  return (
    <div className='relative'>
      {icon}
      <input
        ref={buttonRef}
        className={clsx({
          'flex items-center gap-2 w-full h-10 p-2 pl-10 border rounded-md select-none readonly': true,
          'bg-gray-100': selection,
          'hover:bg-gray-50 cursor-pointer': options.length > 1,
          'cursor-default': options.length === 1,
          'text-transparent': !menuOpen
        })}
        onClick={e => setMenuOpen(!menuOpen && options.length > 1)}
        onFocus={e => handleSearch(e.target.value)}
        onChange={e => handleSearch(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')
            setMenuOpen(!menuOpen && options.length > 1)
        }}
      />
      <span 
        className={clsx({
          'absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none': true,
          'hidden': menuOpen
        })}
      >
        {selection || placeholder}
        <span className='text-gray-500 ml-2'>
          {selection ? `(${placeholder.toLowerCase()})` : ''}
        </span>
      </span>
      <div 
        ref={menuRef}
        className={!menuOpen ? 'hidden' : ''}
      >
        <Menu
          options={options.filter(opt => opt.toLowerCase().includes(filter.toLowerCase()))}
          selectFunction={option => {
            select(option)
            setMenuOpen(false)
          }}
        />
      </div>
    </div>
  )
}

export function Menu({ options, selectFunction }: {
  options: string[],
  selectFunction: (option: string) => void
}) {
  return (
    <div
      className={clsx({
        'absolute top-full left-0 z-20 w-full h-48 p-2 overflow-y-scroll': true,
        'flex flex-col': true,
        'bg-white border rounded-md': true
      })}
    >
      <button
        tabIndex={0}
        className='text-left text-red-600 p-1 hover:bg-red-50'
        onClick={() => selectFunction('')}
      >
        Borrar selección
      </button>
      {options.length > 0 ? options.map((option, i) => (
        <div className='w-full' key={option}>
          <hr className='my-1'/>
          <button
            tabIndex={0}
            className='text-left w-full p-1 hover:bg-gray-50'
            onClick={() => selectFunction(option)}
          >
            {option}
          </button>
        </div>
      )) : 
        <div className='text-left p-1 text-gray-500'>
          No hay ubicaciones...
        </div>
      }
    </div>
  )
}

export function Filter({ icons, title, options }: {
  icons?: JSX.Element[]
  title: string
  options: string[]
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedOptions, setSelectedOptions] 
    = useState(options.map(e => searchParams.get(title.toLowerCase())?.includes(e) || false))

  const select = (index: number) => () => {
    setSelectedOptions(selectedOptions.map((b, i) => i === index ? !b : b))
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (selectedOptions.some(e => e)) {
      params.set(title.toLowerCase(), options.filter((_, i) => selectedOptions[i]).toString());
    } else {
      params.delete(title.toLowerCase());
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedOptions])

  return (
    <div>
      {/* <h2 className='text-lg font-bold'>{title}</h2> */}
      <ul className='flex gap-2'>
        {options.map((option, i) => (
          <li
            key={option}
            className={`flex-1 basis-1/${options.length}`}
          >
            <Button 
              icon={icons ? icons[i] : undefined} 
              label={option}
              selected={selectedOptions[i]}
              select={select(i)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Button({ icon, label, selected, select }: {
  icon?: JSX.Element
  label: string
  selected: boolean
  select: () => void
}) {
  return (
    <button
      className={clsx({
        'flex flex-col items-center gap-1 w-full p-2 border rounded-md': true,
        'bg-gray-100': selected,
        'hover:bg-gray-50': !selected,
        'text-sm': icon,
        'text-base font-semibold': !icon
      })}
      onClick={() => select()}
    >
      {icon}
      {label}
    </button>
  )
}