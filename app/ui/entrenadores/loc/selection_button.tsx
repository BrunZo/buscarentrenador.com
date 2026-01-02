import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import Menu from "./menu"

export default function SelectionButton({ icon, name, placeholder, selection, handleSelect, options }: {
  icon?: React.ReactNode,
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
          'flex items-center gap-2 w-full h-11 p-2 pl-10 pr-10 border-2 rounded-lg select-none': true,
          'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-400 text-indigo-900 font-medium': selection && !menuOpen,
          'bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-soft cursor-pointer': options.length > 1 && !selection && !menuOpen,
          'bg-white border-indigo-500 ring-2 ring-indigo-200 text-gray-900 shadow-soft': menuOpen,
          'cursor-default bg-gray-50 text-gray-400 border-gray-200': options.length === 1,
          'bg-gray-100 text-gray-400 border-gray-200': options.length === 0
        })}
        placeholder={placeholder}
        value={selection}
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
      <div className={clsx({
        'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none': true,
        'rotate-180': menuOpen
      })}>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
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