export default function Students() {
  return (
    <div className='space-y-6 w-full'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Mis Alumnos</h2>
        <p className='text-gray-600'>
          Gestioná la información de tus alumnos
        </p>
      </div>
      
      <div className='pt-4 border-t border-gray-200'>
        <div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300'>
          <svg className='w-16 h-16 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
          </svg>
          <h3 className='text-lg font-semibold text-gray-700 mb-2'>
            No hay alumnos registrados
          </h3>
          <p className='text-sm text-gray-500 max-w-sm mx-auto'>
            Esta funcionalidad estará disponible próximamente. Podrás ver y gestionar la información de tus alumnos aquí.
          </p>
        </div>
      </div>
    </div>
  )
}