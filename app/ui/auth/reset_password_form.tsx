'use client';

import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';
import PasswordStrengthIndicator from '@/app/ui/signup/password_strength_indicator';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('Token de reseteo no válido o ausente');
    }
  }, [token]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError('Token de reseteo no válido');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ocurrió un error. Por favor, intentá de nuevo.');
        return;
      }

      // Redirect to login with success message
      router.push('/login?reset=success');
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className='w-full md:w-2/3 lg:w-1/2 space-y-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>Token inválido</h1>
          <p className='text-gray-600 mb-6'>
            El enlace de reseteo de contraseña no es válido o ha expirado.
          </p>
          <Link
            href='/forgot-password'
            className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='w-full md:w-2/3 lg:w-1/2 space-y-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Resetear tu contraseña</h1>
        <p className='text-gray-600 text-sm'>
          Ingresá tu nueva contraseña a continuación.
        </p>
      </div>

      <div>
        <Input 
          id='password' 
          type='password' 
          name='password' 
          placeholder='Nueva contraseña' 
          required={true}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Input>
        {password && (
          <div className='mt-2'>
            <PasswordStrengthIndicator password={password} />
          </div>
        )}
      </div>

      <Input 
        id='confirmPassword' 
        type='password' 
        name='confirmPassword' 
        placeholder='Confirmar contraseña' 
        required={true}
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        error={!passwordMatch ? 'Las contraseñas no coinciden' : null}
      >
        <LockClosedIcon className='h-5 w-5' />
      </Input>

      <Button 
        text={isLoading ? 'Reseteando...' : 'Resetear contraseña'} 
        disabled={isLoading || !passwordMatch || password.length < 8} 
      />

      <div className='text-center text-gray-600 text-sm'>
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/login'
        >
          Volver al inicio de sesión
        </Link>
      </div>

      {error && (
        <Message
          type='error'
          msg={error}
        />
      )}
    </form>
  );
}
