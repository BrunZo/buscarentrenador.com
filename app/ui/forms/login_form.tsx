'use client';

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check for password reset success message
    if (searchParams.get('reset') === 'success') {
      setSuccessMessage('Tu contraseña ha sido actualizada exitosamente. Podés iniciar sesión con tu nueva contraseña.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowResendVerification(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('pass') as string;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        if (response.status === 403) {
          setShowResendVerification(true);
          setUserEmail(email);
        }
        return;
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Error al iniciar sesión. Por favor, intentá de nuevo.');
      } else {
        router.push('/cuenta');
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full md:w-2/3 lg:w-1/3 space-y-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
      <Input id='email' type='text' name='email' placeholder='Usuario' required={true}>
        <UserIcon className='h-5 w-5' />
      </Input>
      <Input id='pass' type='password' name='pass' placeholder='Contraseña' required={true}>
        <LockClosedIcon className='h-5 w-5' />
      </Input>
      <Button text={isLoading ? 'Ingresando...' : 'Ingresar'} disabled={isLoading} />
      
      <div className='text-center text-gray-600 text-sm'>
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/forgot-password'
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className='text-center text-gray-600'>
        Si no tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/signup'
        >
          registrate
        </Link>.
      </div>

      {successMessage && (
        <Message
          type='success'
          msg={successMessage}
        />
      )}
      {error && (
        <Message
          type='error'
          msg={error}
        />
      )}
      {showResendVerification && (
        <div className='mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 flex flex-col justify-center'>
          <p className='text-sm text-blue-800 mb-3 font-medium'>
            ¿No recibiste el correo de verificación?
          </p>
          <button
            type='button'
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/resend-verification', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: userEmail }),
                });
                const data = await response.json();
                if (response.ok) {
                  setError('Correo de verificación reenviado. Por favor, revisá tu bandeja de entrada.');
                  setShowResendVerification(false);
                } else {
                  setError(data.error || 'Error al reenviar el correo');
                }
              } catch (err) {
                setError('Error al reenviar el correo');
              }
            }}
            className='text-sm text-center text-indigo-600 hover:text-indigo-700 hover:underline font-semibold transition-colors duration-200'
          >
            Reenviar correo de verificación
          </button>
        </div>
      )}
    </form>
  )
}
