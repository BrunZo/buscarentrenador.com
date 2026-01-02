import { useEffect, useState } from "react"
import Option from "@/app/ui/entrenadores/filters/option"

export default function Filter({ icons, name, options, defaultState, handleSelection }: {
  icons?: React.ReactNode[]
  name: string
  options: string[]
  defaultState?: boolean[]
  handleSelection: (selected: boolean[]) => void
}) {
  const [selected, setSelected] = useState<boolean[]>(defaultState || options.map(() => false))

  const handleCheck = (index: number) => {
    setSelected(selected.map((s, j) => index === j ? !s : s))
  }

  useEffect(() => {
    handleSelection(selected)
  }, [selected])

  return (
    <div className="w-full">
      <div className='flex gap-1 md:gap-2'>
        {options.map((option, i) => (
          <div
            key={i}
            className='flex-1 min-w-0'
          >
            <Option
              icon={icons ? icons[i] : undefined}
              name={name + i.toString()}
              label={option}
              selected={selected[i]}
              handleCheck={() => handleCheck(i)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}