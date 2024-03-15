export default function CardGrid() {
  return (
    <div className='flex flex-col border border-gray-200 rounded-md mb-4'>
      <Card/>
      <Card/>
      <Card/>
    </div>
  )
}

export function Card() {
  return (
    <div className='flex gap-8 p-4 m-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded-lg cursor-pointer'>
      <div className='w-32 h-32 bg-gray-200 rounded-full'/>
      <div>
        <h2 className='text-xl font-bold'>[Nombre del entrenador]</h2>
        <p className='text-gray-600 mb-1'>[Localidad], [Provincia]</p>
        <p>
          <span className='font-bold'>Virtual</span>,&nbsp;
          <span className='font-bold'>a domicilio</span> y&nbsp;
          <span className='font-bold'>en dirección particular</span>.
        </p>
        <p>
          <span className='font-bold'>Individual</span> y&nbsp;
          <span className='font-bold'>grupal</span>.
        </p>
        <p>
          <span className='font-bold'>Ñandú</span>,&nbsp;
          <span className='font-bold'>niveles 1, 2 y 3</span> y&nbsp;
          <span className='font-bold'>para selectivos/internacionales</span>.
        </p>
      </div>
    </div>
  )
}