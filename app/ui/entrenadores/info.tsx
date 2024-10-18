import { Entrenador } from "./card"
import Image from 'next/image'

export default function Info({ entrenador }: {
  entrenador: Entrenador
}) {
  return (
    <div className='flex gap-8'>
      <div className='w-96 bg-gray-200 w-36 h-36 rounded-full'>
        <Image
          src='/images/entrenador.jpg'
          alt='Entrenador'
          width={36}
          height={36}
        />
      </div>
      <div>
        <h2 className='text-xl font-bold'>{entrenador.name} {entrenador.surname}</h2>
        <p className='text-gray-600 mb-1'>{entrenador.city}, {entrenador.province}</p>
        {formParagraph('Da clases ', entrenador.place, ['virtuales', 'a domicilio', 'en dirección particular'])}
        {formParagraph('de forma ', entrenador.group, ['individual', 'grupal'])}
        {formParagraph('a alumnos en ', entrenador.level, ['ñandú', 'nivel 1', 'nivel 2', 'nivel 3', 'para selectivos e internacionales'])}
      </div>
    </div>
  )
}

export function formParagraph(pre: string, arr: boolean[], options: string[]) {
  const text = options.filter((_, i) => arr?.at(i))
  return (
    <p>
      {pre}
      {text.map((t, i) => (
        <>
          <span key={t} className='font-semibold'>
            {t}
          </span>
          {i === text.length - 2 ? ' y ' : ''}
          {i < text.length - 2 ? ', ' : ''}
        </>
      ))}
    </p>
  )
}