'use server'

import SignupForm from "@/app/ui/signup/signup_form";

export default async function Page() {
  return (
    <div className='flex flex-col items-center py-8 md:py-12 animate-fade-in'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
          Registrarse
        </h1>
        <p className='text-gray-600'>
          Creá tu cuenta para comenzar
        </p>
      </div>
      <SignupForm />
    </div>
  )
}