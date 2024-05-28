'use client';

import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createUser } from '@/app/lib/actions';
import Link from 'next/link';
import Button from '@/app/ui/form/button';
import Input from '@/app/ui/form/input';
import ErrorMessage from '@/app/ui/form/error';

export default function Page() {
  const router = useRouter();
  const [response, dispatch] = useFormState(createUser, undefined);

  if (response === "200")
    router.push('/login');

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Registrarse
      </h1>
      <form action={dispatch} className="w-1/3 space-y-6">
      <Input
          id="email"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required={true}
        >
          <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="Usuario"
          required={true}
        >
          <UserIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Contraseña"
          required={true}
        >
          <LockClosedIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Input
          id="repeat"
          type="password"
          name="repeat"
          placeholder="Repetir contraseña"
          required={true}
        >
          <LockClosedIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </Input>
        <Button text="Crear cuenta"/>
        <div>
         Si ya tenés cuenta,&nbsp; 
          <Link
            className='text-indigo-600 hover:text-indigo-800 hover:underline'
            href='/login'
          >
            ingresá acá
          </Link>.
        </div>
        <ErrorMessage msg={response}/>
      </form>
    </div>
  )
}