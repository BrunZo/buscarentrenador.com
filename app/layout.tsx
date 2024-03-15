import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./ui/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buscarentrenador.com",
  description: "Entrenadores para la Olimpiada Matemática Argentina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Header/>
        <div className='px-32'>
          {children}
        </div>
      </body>
    </html>
  );
}
