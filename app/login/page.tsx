'use client';

import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';
import Input from '@/app/ui/form/input';
import Button from '@/app/ui/form/button';
import ErrorMessage from '@/app/ui/form/error';

export default function Page() {
  const [response, dispatch] = useFormState(authenticate, undefined);

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Iniciar sesión
      </h1>
      <form action={dispatch} className="w-1/3 space-y-6">
        <Input id="name" type="text" name="name" placeholder="Usuario" required={true}>
          <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Input id="password" type="password" name="password" placeholder="Contraseña" required={true}>
          <LockClosedIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Button text="Ingresar"/>
        <div>
         Si no tenés cuenta,&nbsp; 
          <Link
            className='text-indigo-600 hover:text-indigo-800 hover:underline'
            href='/signup'
          >
            registrate
          </Link>.
        </div>
        <ErrorMessage msg={response}/>
      </form>
    </div>
  )
}