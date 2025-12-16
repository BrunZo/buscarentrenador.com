'use client'

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useMemo, ChangeEvent } from 'react';
import Link from 'next/link';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import Message from '@/app/ui/form/message';

// Validaciones de contraseña
const passwordChecks = {
  minLength: (password: string) => password.length >= 8,
  hasUppercase: (password: string) => /[A-Z]/.test(password),
  hasLowercase: (password: string) => /[a-z]/.test(password),
  hasNumber: (password: string) => /\d/.test(password),
  hasSpecial: (password: string) => /[!@#$%^&*]/.test(password),
};

// Validación de nombre/apellido
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

function PasswordStrengthIndicator({ password }: { password: string }) {
  const checks = useMemo(() => ({
    minLength: passwordChecks.minLength(password),
    hasUppercase: passwordChecks.hasUppercase(password),
    hasLowercase: passwordChecks.hasLowercase(password),
    hasNumber: passwordChecks.hasNumber(password),
    hasSpecial: passwordChecks.hasSpecial(password),
  }), [password]);

  const passedChecks = Object.values(checks).filter(Boolean).length;
  const strengthPercentage = (passedChecks / 5) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage <= 20) return 'bg-red-500';
    if (strengthPercentage <= 40) return 'bg-orange-500';
    if (strengthPercentage <= 60) return 'bg-yellow-500';
    if (strengthPercentage <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthPercentage <= 20) return 'Muy débil';
    if (strengthPercentage <= 40) return 'Débil';
    if (strengthPercentage <= 60) return 'Regular';
    if (strengthPercentage <= 80) return 'Fuerte';
    return 'Muy fuerte';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de fortaleza */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap">{getStrengthText()}</span>
      </div>
      
      {/* Lista de requisitos */}
      <ul className="text-xs space-y-1">
        <li className={checks.minLength ? 'text-green-600' : 'text-gray-500'}>
          {checks.minLength ? '✓' : '○'} Mínimo 8 caracteres
        </li>
        <li className={checks.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasUppercase ? '✓' : '○'} Una letra mayúscula
        </li>
        <li className={checks.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasLowercase ? '✓' : '○'} Una letra minúscula
        </li>
        <li className={checks.hasNumber ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasNumber ? '✓' : '○'} Un número
        </li>
        <li className={checks.hasSpecial ? 'text-green-600' : 'text-gray-500'}>
          {checks.hasSpecial ? '✓' : '○'} Un carácter especial (!@#$%^&*)
        </li>
      </ul>
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validación client-side
  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    
    const email = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;
    const repeatPassword = formData.get('repeat') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    // Validar nombre
    if (!name || name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (!nameRegex.test(name)) {
      errors.name = 'El nombre solo puede contener letras y espacios';
    }

    // Validar apellido
    if (!surname || surname.length < 2) {
      errors.surname = 'El apellido debe tener al menos 2 caracteres';
    } else if (!nameRegex.test(surname)) {
      errors.surname = 'El apellido solo puede contener letras y espacios';
    }

    // Validar contraseña
    if (!passwordValue || passwordValue.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!Object.values(passwordChecks).every(check => check(passwordValue))) {
      errors.password = 'La contraseña no cumple con todos los requisitos';
    }

    // Validar que las contraseñas coincidan
    if (passwordValue !== repeatPassword) {
      errors.repeat = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    
    // Validación client-side
    if (!validateForm(formData)) {
      setIsLoading(false);
      return;
    }

    const email = formData.get('email') as string;
    const passwordValue = formData.get('password') as string;
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: passwordValue,
          name,
          surname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ocurrió un error durante el registro');
      } else {
        setSuccess('¡Cuenta creada exitosamente! Ya podés iniciar sesión.');
        // Limpiar formulario
        e.currentTarget.reset();
        setPassword('');
        // Redirigir al login después de un breve momento
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full md:w-2/3 lg:w-1/3 space-y-6'>
      <div>
        <Input
          id='email'
          type='email'
          name='email'
          placeholder='Correo electrónico'
          required={true}
        >
          <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
        )}
      </div>
      
      <div>
        <Input
          id='name'
          type='text'
          name='name'
          placeholder='Nombre'
          required={true}
        >
          <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
        )}
      </div>
      
      <div>
        <Input
          id='surname'
          type='text'
          name='surname'
          placeholder='Apellido'
          required={true}
        >
          <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
        {fieldErrors.surname && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.surname}</p>
        )}
      </div>
      
      <div>
        <Input
          id='password'
          type='password'
          name='password'
          placeholder='Contraseña'
          required={true}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        >
          <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
        <PasswordStrengthIndicator password={password} />
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
        )}
      </div>
      
      <div>
        <Input
          id='repeat'
          type='password'
          name='repeat'
          placeholder='Repetir contraseña'
          required={true}
        >
          <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
        </Input>
        {fieldErrors.repeat && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.repeat}</p>
        )}
      </div>
      
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
