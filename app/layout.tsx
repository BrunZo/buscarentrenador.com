import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { Providers } from './providers';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Buscarentrenador.com',
  description: 'Entrenadores para la Olimpiada Matemática Argentina',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <Providers>
          {/* Beta Testing Banner */}
          <div className='bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 py-2 text-center'>
            <p className='text-white font-bold text-lg tracking-wider'>
              BETA TESTING
            </p>
          </div>
          
          {/* Warning Banner */}
          <div className='bg-amber-100 border-b-2 border-amber-300 py-3 px-4 text-center'>
            <p className='text-amber-900 font-medium text-sm sm:text-base'>
              ⚠️ Esta página está en fase de pruebas y aún no está disponible para uso público
            </p>
          </div>

          <Header />
          <main className='sm:px-16 md:px-32 px-4 py-8 md:py-12'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
