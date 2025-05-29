'use client';

import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import Message from '@/app/ui/form/message';

export default function LoginForm() {
  const router = useRouter();


  return (
    <form className='w-1/3 space-y-6'>
      <Input id='email' type='text' name='email' placeholder='Usuario' required={true}>
        <UserIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
      </Input>
      <Input id='pass' type='password' name='pass' placeholder='Contraseña' required={true}>
        <LockClosedIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500' />
      </Input>
      <Button text='Ingresar' />
      <div>
        Si no tenés cuenta,&nbsp;
        <Link
          className='text-indigo-600 hover:text-indigo-800 hover:underline'
          href='/signup'
        >
          registrate
        </Link>.
      </div>
      {/* <Message
        type={response?.status === 200 ? 'success' : 'error'}
        msg={response?.msg}
      /> */}
    </form>
  )
}