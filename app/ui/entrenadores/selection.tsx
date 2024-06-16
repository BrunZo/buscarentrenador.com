'use client'

import { GlobeAmericasIcon, MapPinIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function LocationFilter({ 
  options, 
  defaultOptions,
  replaceUrl=false
}: {
  options: { [key: string]: string[] },
  defaultOptions: { [key: string]: string },
  replaceUrl?: boolean
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [provSelection, setProvSelection] = useState(defaultOptions.prov || '')
  const [locSelection, setLocSelection] = useState(defaultOptions.loc || '')

  useEffect(() => {
    if (replaceUrl) {
      const params = new URLSearchParams(searchParams);
      params.set('prov', provSelection);
      params.set('loc', locSelection);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [provSelection, locSelection])

  return (
    <div className='flex flex-col gap-2'>
      <SelectionButton
        icon={<GlobeAmericasIcon className='absolute w-4 w-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name={'prov'}
        placeholder='Provincia'
        selection={provSelection}
        handleSelect={(option) => {
          if (option !== provSelection)
            setLocSelection('')
          setProvSelection(option)
          if (options[option] && options[option].length === 1)
            setLocSelection(options[option][0])
        }}
        options={Object.keys(options)}
      />
      <SelectionButton
        icon={<MapPinIcon className='absolute w-4 h-4 z-10 left-3 top-1/2 transform -translate-y-1/2' />}
        name={'loc'}
        placeholder='Localidad'
        selection={locSelection}
        handleSelect={(option) => {
          setLocSelection(option)
        }}
        options={provSelection ? options[provSelection] : []}
      />
    </div>
  )
}

export function SelectionButton({ icon, name, placeholder, selection, handleSelect, options }: {
  icon?: JSX.Element,
  name: string,
  placeholder: string,
  selection: string,
  handleSelect: (option: string) => void,
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
        name={name}
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
        autoComplete='off'
      />
      <span
        className={clsx({
          'absolute top-1/2 left-10 -translate-y-1/2 pointer-events-none': true,
          'hidden': menuOpen
        })}
      >
        {selection || placeholder}
        <span className='ml-1 text-gray-500'>
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
            setMenuOpen(false)
            handleSelect(option)
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
      <div
        tabIndex={0}
        className='text-left text-red-600 w-full p-1 hover:bg-red-50'
        onClick={() => selectFunction('')}
      >
        Borrar selección
      </div>
      {options.length > 0 ? options.map((option, i) => (
        <div className='w-full' key={option}>
          <hr className='my-1' />
          <div
            tabIndex={0}
            className='text-left w-full p-1 hover:bg-gray-50'
            onClick={() => selectFunction(option)}
          >
            {option}
          </div>
        </div>
      )) :
        <div className='text-left p-1 text-gray-500'>
          No hay ubicaciones...
        </div>
      }
    </div>
  )
}