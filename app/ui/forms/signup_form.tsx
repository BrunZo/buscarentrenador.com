'use client'

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import Message from '@/app/ui/form/message';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const repeatPassword = formData.get('repeat') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;

    // Validate passwords match
    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          surname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred during signup');
      } else {
        setSuccess('Account created successfully! You can now log in.');
        // Clear form
        e.currentTarget.reset();
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-1/3 space-y-6'>
      <Input
        id='email'
        type='email'
        name='email'
        placeholder='Correo electrónico'
        required={true}
      >
        <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </Input>
      <Input
        id='name'
        type='text'
        name='name'
        placeholder='Nombre'
        required={true}
      >
        <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </Input>
      <Input
        id='surname'
        type='text'
        name='surname'
        placeholder='Apellido'
        required={true}
      >
        <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </Input>
      <Input
        id='password'
        type='password'
        name='password'
        placeholder='Contraseña'
        required={true}
      >
        <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </Input>
      <Input
        id='repeat'
        type='password'
        name='repeat'
        placeholder='Repetir contraseña'
        required={true}
      >
        <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
      </Input>
      <Button text={isLoading ? 'Creando cuenta...' : 'Crear cuenta'} disabled={isLoading} />
      <div>
        Si ya tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-800 hover:underline'
          href='/login'
        >
          ingresá acá
        </Link>.
      </div>
      {error && (
        <Message
          type='error'
          msg={error}
        />
      )}
      {success && (
        <Message
          type='success'
          msg={success}
        />
      )}
    </form>
  )
}