'use client'

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { login } from '@/app/lib/actions';
import Link from 'next/link';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/error';

export default function Page() {
  const router = useRouter();
  const [response, dispatch] = useFormState(login, undefined);

  if (response?.status == 200)
    router.push('/');

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Iniciar sesión
      </h1>
      <form action={dispatch} className='w-1/3 space-y-6'>
        <Input id='email' type='text' name='email' placeholder='Usuario' required={true}>
          <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
        </Input>
        <Input id='pass' type='password' name='pass' placeholder='Contraseña' required={true}>
          <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
        </Input>
        <Button text='Ingresar'/>
        <div>
         Si no tenés cuenta,&nbsp; 
          <Link
            className='text-indigo-600 hover:text-indigo-800 hover:underline'
            href='/signup'
          >
            registrate
          </Link>.
        </div>
        <Message 
          type={response?.status === 200 ? 'success' : 'error'}
          msg={response?.msg}
        />
      </form>
    </div>
  )
}