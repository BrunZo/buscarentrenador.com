'use client';

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authClient } from '@/service/auth/auth-client';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';
import GoogleSignInButton from '@/app/ui/forms/google_signin_button';

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  account_not_linked: 'Esta cuenta ya está registrada con email y contraseña. Iniciá sesión con tu contraseña.',
  signup_disabled: 'No pudimos crear la cuenta con Google. Intentá de nuevo.',
  email_not_found: 'No pudimos obtener tu correo de Google. Intentá de nuevo.',
};

const GENERIC_GOOGLE_ERROR = 'No pudimos iniciar sesión con Google. Intentá de nuevo.';
const GENERIC_LOGIN_ERROR = 'Correo electrónico o contraseña incorrectos.';
const UNVERIFIED_ERROR = 'Tu correo electrónico no está verificado. Te enviamos un nuevo enlace de verificación.';
const RATE_LIMIT_ERROR = 'Demasiados intentos. Intentá de nuevo más tarde.';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccessMessage('Tu contraseña ha sido actualizada exitosamente. Podés iniciar sesión con tu nueva contraseña.');
    }
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(GOOGLE_ERROR_MESSAGES[errorParam] ?? GENERIC_GOOGLE_ERROR);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('pass') as string;

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        if (signInError.status === 403) setError(UNVERIFIED_ERROR);
        else if (signInError.status === 429) setError(RATE_LIMIT_ERROR);
        else setError(GENERIC_LOGIN_ERROR);
        return;
      }

      router.push('/cuenta');
      router.refresh();
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

      <div className='flex items-center gap-3'>
        <div className='h-px flex-1 bg-gray-200' />
        <span className='text-xs uppercase tracking-wide text-gray-400'>o</span>
        <div className='h-px flex-1 bg-gray-200' />
      </div>

      <GoogleSignInButton label='Iniciar sesión con Google' />

      <div className='flex flex-col items-center gap-2 text-gray-600 text-sm'>
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/forgot-password'
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/resend-verification'
        >
          ¿No recibiste el correo de verificación?
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
    </form>
  )
}
