'use server'

import Dashboard from '@/app/ui/cuenta/dashboard';
import { getUserData } from '@/app/auth';

export default async function Page() {
  const response = await getUserData()
  if (response.status !== 200)
    return { status: 401, redirect: '/login' }

  const userData = response.payload

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
        {!userData?.entr && <>
          <p>Aún no eres un entrenador...</p>
          <a href='/soy-entrenador'>¡Hazte entrenador!</a>
        </>}
        {userData && <Dashboard userData={userData}/>}
    </div>
  );
};
