'use server';

import LoginForm from "@/app/ui/forms/login_form"

export default async function Page() {  
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Iniciar sesión
      </h1>
      <LoginForm />
    </div>
  )
}