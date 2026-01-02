import clsx from "clsx"
import { CheckIcon } from '@heroicons/react/24/solid'

export default function Option({ icon, name, label, selected, handleCheck }: {
  icon?: React.ReactNode
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
      <button
        type="button"
        className={clsx({
          'relative flex flex-col items-center justify-center gap-2 w-full p-3 border-2 rounded-lg select-none transition-all duration-200': true,
          'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-600 shadow-medium': selected,
          'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-soft': !selected,
          'text-sm': icon,
          'font-semibold text-xs': !icon,
          'transform hover:scale-105 active:scale-95': true,
        })}
        onClick={() => handleCheck()}
      >
        {selected && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-soft">
            <CheckIcon className="w-3 h-3 text-indigo-600" />
          </div>
        )}
        {icon && (
          <div className={clsx({
            'transition-transform duration-200': true,
            'scale-110': selected,
          })}>
            {icon}
          </div>
        )}
        <span className={clsx({
          'font-medium text-xs': true,
          'text-white': selected,
          'text-gray-700': !selected,
        })}>
          {label}
        </span>
      </button>
    </>
  )
}