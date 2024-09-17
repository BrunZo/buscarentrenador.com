import clsx from "clsx"

export default function Menu({ options, selectFunction }: {
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