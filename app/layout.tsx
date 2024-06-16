import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/app/ui/header';
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
        <Header />
        <div className='px-32'>
          {children}
        </div>
      </body>
    </html>
  );
}
