import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='mt-16 border-t border-gray-200 bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50'>
      <div className='sm:px-16 md:px-32 px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-6'>
          {/* Contacto */}
          <div className='flex flex-col items-center md:items-start'>
            <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center gap-2'>
              <svg className='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
              Contacto
            </h3>
            <a 
              href='mailto:buscarentrenador@gmail.com'
              className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2'
            >
              buscarentrenador@gmail.com
            </a>
          </div>

          {/* Instagram OMA */}
          <div className='flex flex-col items-center'>
            <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center gap-2'>
              <svg className='w-5 h-5 text-indigo-600' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
              </svg>
              Redes Sociales OMA
            </h3>
            <a 
              href='https://www.instagram.com/oma.org.ar'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group'
            >
              @oma.org.ar
              <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
              </svg>
            </a>
          </div>

          {/* Web Oficial OMA */}
          <div className='flex flex-col items-center md:items-end'>
            <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center gap-2'>
              <svg className='w-5 h-5 text-indigo-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
              </svg>
              Web Oficial OMA
            </h3>
            <a 
              href='https://www.oma.org.ar'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group'
            >
              oma.org.ar
              <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className='pt-6 border-t border-gray-200 text-center'>
          <p className='text-sm text-gray-500'>
            © {new Date().getFullYear()} Buscarentrenador.com - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
