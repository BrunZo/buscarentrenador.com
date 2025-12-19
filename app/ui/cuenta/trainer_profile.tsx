import clsx from "clsx"
import { useRouter } from "next/navigation"
import Info from "@/app/ui/entrenadores/info"
import { Trainer } from "@/types/trainers"

export default function TrainerProfile({ trainer }: {
  trainer: Trainer
}) {
  const router = useRouter()

  return (
    <div className='space-y-2 w-full'>
      <h2 className='text-xl font-semibold'>Perfil de entrenador</h2>
      <p>
        Acá podrás ver la información de tu perfil de entrenador.
      </p>
      <div className='p-3 border border-gray-200 rounded-md'>
        <Info trainer={trainer}/>
      </div>
      <button
        className={clsx({
          'w-full flex justify-center py-2 px-4': true,
          'border border-transparent rounded-md shadow-sm text-sm font-medium text-white': true,
          'bg-indigo-600 hover:bg-indigo-700': true,
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true
        })}
        onClick={() => router.push('/soy-entrenador')}
      >
        Editar perfil
      </button>
    </div>
  )
}