import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import Menu from "./menu"

export default function SelectionButton({ icon, name, placeholder, selection, handleSelect, options }: {
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
      if (menuOpen) buttonRef.current.focus()
      else buttonRef.current.blur()
    }
  }, [menuOpen, selection])

  useEffect(() => {
    document.addEventListener('click', (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    })
  }, [menuRef, buttonRef, selection])

  return (
    <div className='relative'>
      {icon}
      <input
        ref={buttonRef}
        className={clsx({
          'flex items-center gap-2 w-full h-10 p-2 pl-10 border rounded-md select-none readonly': true,
          'bg-indigo-200': selection && !menuOpen,
          'hover:bg-indigo-200 cursor-pointer': options.length > 1 && !selection,
          'cursor-default': options.length === 1,
          'text-transparent': !menuOpen
        })}
        name={name}
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