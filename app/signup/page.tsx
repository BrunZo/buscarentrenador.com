'use server'

import SignupForm from "@/app/ui/signup/signup_form";

export default async function Page() {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>
        Registrarse
      </h1>
      <SignupForm />
    </div>
  )
}