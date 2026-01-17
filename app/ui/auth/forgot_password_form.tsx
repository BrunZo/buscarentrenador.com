'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ocurrió un error. Por favor, intentá de nuevo.');
        return;
      }

      setMessage(data.message);
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full md:w-2/3 lg:w-1/2 space-y-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>¿Olvidaste tu contraseña?</h1>
        <p className='text-gray-600 text-sm'>
          Ingresá tu correo electrónico y te enviaremos un enlace para resetear tu contraseña.
        </p>
      </div>

      <Input 
        id='email' 
        type='email' 
        name='email' 
        placeholder='Correo electrónico' 
        required={true}
      >
        <EnvelopeIcon className='h-5 w-5' />
      </Input>

      <Button 
        text={isLoading ? 'Enviando...' : 'Enviar enlace de reseteo'} 
        disabled={isLoading} 
      />

      <div className='text-center text-gray-600 text-sm'>
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/login'
        >
          Volver al inicio de sesión
        </Link>
      </div>

      {message && (
        <Message
          type='success'
          msg={message}
        />
      )}

      {error && (
        <Message
          type='error'
          msg={error}
        />
      )}
    </form>
  );
}
