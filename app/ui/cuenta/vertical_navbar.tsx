import clsx from "clsx"

const icons = [
  <svg key="account" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>,
  <svg key="trainer" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>,
  <svg key="students" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
]

export default function VerticalNavbar({ options, selected, handler }: {
  options: string[]
  selected: number
  handler: (i: number) => void
}) {
  return (
    <div className='flex flex-col gap-2 w-full md:w-64 shrink-0'>
      {options.map((option, i) => (
        <button
          key={i}
          type="button"
          className={clsx({
            'flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 font-medium': true,
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-medium': i === selected,
            'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700': i !== selected,
          })}
          onClick={() => handler(i)}
        >
          {icons[i]}
          <span>{option}</span>
        </button>
      ))} 
    </div>
  )
}
