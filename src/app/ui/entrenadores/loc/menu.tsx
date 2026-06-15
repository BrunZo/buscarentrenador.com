import clsx from "clsx"
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Menu({ options, selectFunction }: {
  options: string[],
  selectFunction: (option: string) => void
}) {
  return (
    <div
      className={clsx({
        'absolute top-full left-0 z-20 w-full max-h-64 mt-1 overflow-hidden': true,
        'bg-white border-2 border-gray-200 rounded-lg shadow-large': true
      })}
    >
      <div className="overflow-y-auto max-h-64 custom-scrollbar">
        <button
          type="button"
          tabIndex={0}
          className='w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer font-medium border-b border-gray-100'
          onClick={() => selectFunction('')}
        >
          <XMarkIcon className="w-4 h-4" />
          Borrar selección
        </button>
        {options.length > 0 ? (
          <div className="py-1">
            {options.map((option, i) => (
              <button
                key={i}
                type="button"
                tabIndex={0}
                className='w-full text-left px-4 py-2.5 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer font-medium text-gray-700'
                onClick={() => selectFunction(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className='text-center px-4 py-8 text-gray-500'>
            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No hay opciones disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}