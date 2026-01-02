'use client'

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ResendVerification from '@/app/ui/auth/resend_verification';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Token de verificación no proporcionado');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Error al verificar el correo electrónico');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage('Ocurrió un error al verificar el correo electrónico');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg'>
        {status === 'loading' && (
          <div className='text-center'>
            <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent'></div>
            <h1 className='text-2xl font-bold text-gray-900'>Verificando tu correo...</h1>
            <p className='mt-2 text-gray-600'>Por favor, esperá un momento.</p>
          </div>
        )}

        {status === 'success' && (
          <div className='text-center'>
            <div className='mb-4 flex justify-center'>
              <svg className='h-16 w-16 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>¡Correo verificado exitosamente!</h1>
            <p className='mt-2 text-gray-600'>
              Tu cuenta ha sido verificada. Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Link
              href='/login'
              className='mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700'
            >
              Ir al inicio de sesión
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='text-center'>
            <div className='mb-4 flex justify-center'>
              <svg className='h-16 w-16 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900'>Error de verificación</h1>
            <p className='mt-2 text-red-600'>{errorMessage}</p>
            
            <div className='mt-8'>
              <h2 className='mb-4 text-lg font-semibold text-gray-900'>
                Reenviar correo de verificación
              </h2>
              <ResendVerification />
            </div>

            <Link
              href='/login'
              className='mt-6 inline-block text-indigo-600 hover:text-indigo-800 hover:underline'
            >
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function LoadingFallback() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg'>
        <div className='text-center'>
          <div className='mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent'></div>
          <h1 className='text-2xl font-bold text-gray-900'>Cargando...</h1>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
