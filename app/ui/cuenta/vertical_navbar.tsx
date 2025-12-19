import clsx from "clsx"

export default function VerticalNavbar({ options, selected, handler }: {
  options: string[]
  selected: number
  handler: (i: number) => void
}) {
  return (
    <div className='flex flex-col gap-2 w-96'>
      {options.map((option, i) => (
        <div key={i} className={clsx({
          'p-2 rounded-md cursor-pointer': true,
          'bg-gray-200': i === selected,
          'hover:bg-gray-50': i !== selected
        })} onClick={() => handler(i)}>
          {option}
        </div>
      ))} 
    </div>
  )
}
