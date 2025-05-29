'use client'

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import Message from '@/app/ui/form/message';

export default function SignupForm() {
  const router = useRouter();

  return (
    <form className='w-1/3 space-y-6'>
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
      <Button text='Crear cuenta' />
      <div>
        Si ya tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-800 hover:underline'
          href='/login'
        >
          ingresá acá
        </Link>.
      </div>
      {/* <Message
        type={response?.status === 200 ? 'success' : 'error'}
        msg={response?.msg}
      /> */}
    </form>
  )
}