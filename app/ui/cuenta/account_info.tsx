import { User } from "next-auth"

export default function AccountInfo({ user }: {
  user: User
}) {
  return (
    <div className='space-y-6 w-full'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Mi Cuenta</h2>
        <p className='text-gray-600'>
          Información personal de tu cuenta
        </p>
      </div>
      
      <div className='space-y-4 pt-4 border-t border-gray-200'>
        <div className='flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100'>
          <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Correo electrónico</div>
            <div className='text-base font-semibold text-gray-900'>{user.email}</div>
          </div>
        </div>
        
        <div className='flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100'>
          <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Nombre</div>
            <div className='text-base font-semibold text-gray-900'>{user.name || 'No especificado'}</div>
          </div>
        </div>
        
        <div className='flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100'>
          <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-medium text-gray-500 mb-1'>Apellido</div>
            <div className='text-base font-semibold text-gray-900'>{user.surname || 'No especificado'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
