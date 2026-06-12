'use client'

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import Message from '@/app/ui/form/message';
import PasswordStrengthIndicator from '@/app/ui/signup/password_strength_indicator';
import validateForm from '@/app/ui/signup/client_validation';
import GoogleSignInButton from '@/app/ui/forms/google_signin_button';
import { authClient } from '@/service/auth/auth-client';

const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS: 'El correo electrónico ya está en uso',
  INVALID_EMAIL: 'El correo electrónico no es válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
};

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [repeat, setRepeat] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        surname,
      });

      if (signUpError) {
        const mapped = signUpError.code ? SIGNUP_ERROR_MESSAGES[signUpError.code] : undefined;
        if (signUpError.status === 429) {
          setError('Demasiados intentos. Intentá de nuevo más tarde.');
        } else {
          // Validation hooks on the server already produce Spanish messages.
          setError(mapped || signUpError.message || 'Ocurrió un error durante el registro');
        }
      } else {
        setSuccess('¡Cuenta creada exitosamente! Te enviamos un correo de verificación. Por favor, revisá tu bandeja de entrada.');
        setEmail('');
        setPassword('');
        setRepeat('');
        setName('');
        setSurname('');
        setFieldErrors({});
        router.push('/login');
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full md:w-2/3 lg:w-1/3 space-y-6 pb-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
      <div>
        <Input
          id='email'
          type='email'
          name='email'
          placeholder='Correo electrónico'
          required={true}
          error={fieldErrors.email}
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        >
          <UserIcon className='h-5 w-5' />
        </Input>
      </div>
      
      <div>
        <Input
          id='name'
          type='text'
          name='name'
          placeholder='Nombre'
          required={true}
          error={fieldErrors.name}
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        >
          <UserIcon className='h-5 w-5' />
        </Input>
      </div>
      
      <div>
        <Input
          id='surname'
          type='text'
          name='surname'
          placeholder='Apellido'
          required={true}
          value={surname}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
          error={fieldErrors.surname}
        >
          <UserIcon className='h-5 w-5' />
        </Input>
      </div>
      
      <div>
        <Input
          id='password'
          type='password'
          name='password'
          placeholder='Contraseña'
          required={true}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          error={fieldErrors.password}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Input>
        <PasswordStrengthIndicator password={password} />
      </div>
      
      <div>
        <Input
          id='repeat'
          type='password'
          name='repeat'
          placeholder='Repetir contraseña'
          required={true}
          error={fieldErrors.repeat}
          value={repeat}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setRepeat(e.target.value)}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Input>
      </div>
      
      <Button text={isLoading ? 'Creando cuenta...' : 'Crear cuenta'} disabled={isLoading} />

      <div className='flex items-center gap-3'>
        <div className='h-px flex-1 bg-gray-200' />
        <span className='text-xs uppercase tracking-wide text-gray-400'>o</span>
        <div className='h-px flex-1 bg-gray-200' />
      </div>

      <GoogleSignInButton label='Registrarse con Google' />

      <div className='space-y-2 text-center text-gray-600'>
        Si ya tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-colors duration-200'
          href='/login'
        >
          ingresá acá
        </Link>.
        {error && (<Message type='error' msg={error} />)}
        {success && (<Message type='success' msg={success} />)}
      </div>
    </form>
  )
}
