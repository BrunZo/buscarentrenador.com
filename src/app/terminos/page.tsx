import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Buscarentrenador.com',
  description:
    'Términos y Condiciones de uso de la plataforma Buscarentrenador.com.',
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='space-y-3'>
      <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
      {children}
    </section>
  );
}

function Clause({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className='text-gray-700 leading-relaxed'>
      <span className='font-semibold text-gray-900'>{label} </span>
      {children}
    </p>
  );
}

export default function Page() {
  return (
    <div className='flex flex-col items-center py-8 md:py-12 animate-fade-in'>
      <div className='w-full max-w-3xl bg-white rounded-2xl p-8 md:p-12 shadow-large border border-gray-100'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
          Términos y Condiciones de Buscarentrenador.com
        </h1>

        <div className='space-y-8'>
          <Section title='1. Naturaleza del Servicio y Límite de Responsabilidad'>
            <p className='text-gray-700 leading-relaxed'>
              Buscarentrenador.com funciona exclusivamente como un nexo para
              facilitar el contacto entre entrenadores y alumnos. Ningún
              entrenador o profesor listado es empleado de la plataforma.
            </p>
            <p className='text-gray-700 leading-relaxed'>
              Por lo tanto, la plataforma no se hace responsable por la calidad
              pedagógica de las clases impartidas ni por la idoneidad de los
              entrenadores. Asimismo, Buscarentrenador.com no interviene en los
              acuerdos privados entre las partes. Cualquier disputa relacionada
              con honorarios, inasistencias o la calidad de las clases deberá
              resolverse de forma privada entre el entrenador y el alumno (o sus
              responsables legales). La plataforma queda expresamente exenta de
              toda responsabilidad frente a dichos inconvenientes.
            </p>
          </Section>

          <Section title='2. Protección de Menores de Edad'>
            <Clause label='Consentimiento de padre, madre o tutor legal:'>
              Si el usuario es menor de 18 años, el registro en la plataforma y la
              posterior contratación de un entrenador deberán ser realizados por
              su padre, madre o tutor legal, o bien contar con la supervisión y el
              consentimiento explícito de los mismos.
            </Clause>
            <Clause label='Supervisión y selección de profesionales:'>
              Buscarentrenador.com actúa de buena fe basándose en la información
              proporcionada por los usuarios al momento de registrarse. Si bien
              promovemos un ambiente educativo y de respeto, la plataforma no
              puede avalar ni garantizar la conducta o idoneidad de los usuarios.
              Por este motivo, es responsabilidad exclusiva e indelegable de los
              padres o tutores realizar su propia evaluación al elegir un
              entrenador y supervisar activamente el desarrollo de las clases y
              las comunicaciones entre las partes.
            </Clause>
          </Section>

          <Section title='3. Cuentas de Usuario y Entrenador'>
            <Clause label='Veracidad de datos:'>
              Todos los usuarios (tanto entrenadores como alumnos) están obligados
              a proporcionar información real, exacta y comprobable. La plataforma
              no se hace responsable de los problemas que pueda causar el
              incumplimiento de esta norma.
            </Clause>
            <Clause label='Aprobación de entrenadores:'>
              Todos los perfiles de los entrenadores serán revisados y aprobados
              manualmente por la administración de la plataforma. Esta se reserva
              el derecho a solicitar correcciones, modificaciones o información
              respaldatoria en algunos de los datos personales introducidos. De
              todas formas, este control no garantiza idoneidad absoluta de los
              entrenadores en esta plataforma.
            </Clause>
            <Clause label='Derecho de admisión y permanencia:'>
              La plataforma se reserva el derecho de suspender o dar de baja
              permanentemente aquellas cuentas que infrinjan estas normas de
              convivencia o hagan un uso indebido del sitio.
            </Clause>
          </Section>

          <Section title='4. Política de Privacidad'>
            <p className='text-gray-700 leading-relaxed'>
              La plataforma cumple con la Ley N° 25.326 de Protección de los Datos
              Personales de la República Argentina. La información recopilada se
              utiliza exclusivamente para el funcionamiento de la plataforma y
              para proveer filtros de búsqueda precisos a los usuarios.
            </p>
            <Clause label='Información visible:'>
              Para los entrenadores, una vez aprobados, el nombre, la ciudad y
              provincia de residencia serán visibles para cualquier persona que
              ingrese al sitio web. La información de contacto, como el correo
              electrónico y/o número de teléfono, sólo será visible para los
              usuarios registrados. Buscarentrenador.com no asume responsabilidad
              alguna por el uso indebido que los usuarios registrados puedan darle
              a la información de contacto (correo electrónico y/o teléfono)
              visible en los perfiles de los entrenadores.
            </Clause>
            <Clause label='Uso compartido de datos con proveedores tecnológicos:'>
              Buscarentrenador.com no vende, comercializa ni alquila la
              información personal de los usuarios a terceros bajo ninguna
              circunstancia. Sin embargo, para garantizar el correcto
              funcionamiento de la plataforma, ciertos datos pueden ser procesados
              o almacenados por proveedores de servicios de infraestructura
              tecnológica. El acceso por parte de estos terceros se limita
              estrictamente a fines técnicos, de usabilidad y operativos, y en
              ningún caso con fines monetarios o comerciales.
            </Clause>
          </Section>

          <Section title='5. Ley Aplicable y Jurisdicción'>
            <p className='text-gray-700 leading-relaxed'>
              Cualquier controversia legal derivada del uso de esta plataforma
              será interpretada y resuelta bajo las leyes de la República
              Argentina, sometiéndose a la jurisdicción de los Tribunales
              Ordinarios de la Ciudad Autónoma de Buenos Aires.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
