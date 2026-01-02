import clsx from "clsx"
import { useRouter } from "next/navigation"
import Info from "@/app/ui/entrenadores/info"
import { Trainer } from "@/types/trainers"

export default function TrainerProfile({ trainer }: {
  trainer: Trainer
}) {
  const router = useRouter()

  return (
    <div className='space-y-6 w-full'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Perfil de Entrenador</h2>
        <p className='text-gray-600'>
          Información de tu perfil público como entrenador
        </p>
      </div>
      
      <div className='pt-4 border-t border-gray-200'>
        <Info trainer={trainer} showMail={true}/>
      </div>
      
      <div className='pt-4 border-t border-gray-200'>
        <button
          className={clsx({
            'w-full flex items-center justify-center gap-2 py-3 px-6': true,
            'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg': true,
            'hover:from-indigo-700 hover:to-purple-700 shadow-medium hover:shadow-large': true,
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true,
            'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]': true
          })}
          onClick={() => router.push('/soy-entrenador')}
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
          </svg>
          Editar perfil
        </button>
      </div>
    </div>
  )
}