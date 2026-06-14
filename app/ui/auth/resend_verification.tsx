'use client'

import { useState } from 'react';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import Message from '@/app/ui/form/message';
import { UserIcon } from '@heroicons/react/24/outline';
import { authClient } from '@/service/auth/auth-client';

interface ResendVerificationProps {
  initialEmail?: string;
}

export default function ResendVerification({ initialEmail = '' }: ResendVerificationProps) {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: '/verify-email',
      });

      if (resendError && resendError.status === 429) {
        setError('Demasiados intentos. Intentá de nuevo más tarde.');
      } else {
        // Uniform message regardless of whether the account exists.
        setSuccess('Si el correo está registrado y no fue verificado, te enviamos un nuevo enlace de verificación.');
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full space-y-4'>
      <div>
        <Input
          id='resend-email'
          type='email'
          name='email'
          placeholder='Correo electrónico'
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        >
          <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
      </div>
      
      <Button 
        text={isLoading ? 'Enviando...' : 'Reenviar correo de verificación'} 
        disabled={isLoading} 
      />
      
      <div className='space-y-2'>
        {error && (<Message type='error' msg={error} />)}
        {success && (<Message type='success' msg={success} />)}
      </div>
    </form>
  );
}
