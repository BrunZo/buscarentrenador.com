import clsx from "clsx"

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
      <div 
        className={clsx({
          'flex flex-col items-center gap-1 w-full p-2 border rounded-md select-none': true,
          'bg-indigo-600 text-white': selected,
          'hover:bg-indigo-200': !selected,
          'text-sm': icon,
          'font-semibold': !icon
        })}
        onClick={() => handleCheck()}
      >
        {icon}
        {label}
      </div>
    </>
  )
}