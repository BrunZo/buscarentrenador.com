import Link from 'next/link';

export default function Home() {
  return (
    <div className='animate-fade-in'>
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 mb-12 shadow-large'>
        <div className='relative z-10'>
          <h1 className='text-4xl md:text-5xl font-bold gradient-text mb-4'>
            Buscarentrenador.com
          </h1>
          <p className='text-xl md:text-2xl gradient-text mb-6 max-w-2xl'>
            Encontrá a tu entrenador para la Olimpiada Matemática Argentina
          </p>
          <div className='flex flex-wrap gap-4'>
            <Link
              href='/entrenadores'
              className='px-6 py-3 bg-cyan-50/50 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-100 hover:scale-105 transition-all duration-200 shadow-medium'
            >
              Buscar Entrenadores
            </Link>
            <Link
              href='/soy-entrenador'
              className='px-6 py-3 bg-rose-50/50 text-rose-600 font-semibold rounded-lg hover:bg-rose-100 hover:scale-105 transition-all duration-200'
            >
              Soy Entrenador
            </Link>
          </div>
        </div>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2'></div>
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2'></div>
      </div>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        <div className='bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100'>
          <div className='w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-3'>
            La Olimpiada
          </h2>
          <p className='text-gray-600 mb-4 leading-relaxed'>
            La Olimpiada Matemática Argentina es un evento anual que reúne a estudiantes argentinos 
            en una competencia de problemas matemáticos.
          </p>
          <Link 
            className='inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold group'
            href='https://www.oma.org.ar'
            target='_blank'
            rel='noopener noreferrer'
          >
            Página oficial
            <svg className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-3'>
            Buscar Entrenador
          </h2>
          <p className='text-gray-600 mb-4 leading-relaxed'>
            Explorá nuestra base de datos de entrenadores activos y encontrá el que mejor se adapte a tus necesidades.
          </p>
          <Link 
            className='inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold group'
            href='/entrenadores'
          >
            Ver entrenadores
            <svg className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>

        <div className='bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border border-gray-100'>
          <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-4'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-3'>
            Soy Entrenador
          </h2>
          <p className='text-gray-600 mb-4 leading-relaxed'>
            Inscribite como entrenador y permití que los estudiantes te encuentren fácilmente.
          </p>
          <Link 
            className='inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold group'
            href='/soy-entrenador'
          >
            Inscribirme
            <svg className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
