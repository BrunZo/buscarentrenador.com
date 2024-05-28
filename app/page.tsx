import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className='text-2xl font-semibold mb-2'>
        Buscarentrenador.com
      </h1>
      <p className='mb-5'>
        Una página donde podés encontrar un entrenador para la Olimpiada Matemática Argentina.
      </p>
      <div className='flex gap-4'>
        <div className='w-1/3'>
          <h1 className='text-xl text-center font-semibold mb-2'>
            La Olimpiada
          </h1>
          <p>
            La Olimpiada Matemática Argentina es un evento anual que reúne a estudiantes argentinos 
            en una competencia de problemas matemáticos.
          </p>
          <Link 
            className='text-indigo-600 hover:text-indigo-800'
            href='https://www.oma.org.ar'
          >
            Página oficial de la OMA
          </Link>
        </div>
        <div className='w-1/3'>
          <h1 className='text-xl text-center font-semibold mb-2'>
            Buscar entrenador
          </h1>
          <p>
            Podés ver los entrenadores activos en este sitio:
          </p>
          <Link 
            className='text-indigo-600 hover:text-indigo-800'
            href='/entrenadores'
          >
            Ver entrenadores
          </Link>
        </div>
        <div className='w-1/3'>
          <h1 className='text-center text-xl font-semibold mb-2'>
            Soy entrenador
          </h1>
          <p>
            Podés inscribirte y que los demás puedan encontrarte:
          </p>
          <Link 
            className='text-indigo-600 hover:text-indigo-800'
            href='/soy-entrenador'
          >
            Inscribirme
          </Link>
        </div>
      </div>
    </div>
  );
}
