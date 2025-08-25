'use client';

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('pass') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/cuenta');
        router.refresh();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-1/3 space-y-6'>
      <Input id='email' type='text' name='email' placeholder='Usuario' required={true}>
        <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
      </Input>
      <Input id='pass' type='password' name='pass' placeholder='Contraseña' required={true}>
        <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
      </Input>
      <Button text={isLoading ? 'Ingresando...' : 'Ingresar'} disabled={isLoading} />
      <div>
        Si no tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-800 hover:underline'
          href='/signup'
        >
          registrate
        </Link>.
      </div>
      {error && (
        <Message
          type='error'
          msg={error}
        />
      )}
    </form>
  )
}