'use server'

import { getSession, getUserByID } from '@/auth';
import Dashboard from '@/app/ui/cuenta/dashboard';

export default async function Page() {
  const session = await getSession()
  const userData = await getUserByID(session.userId)

  return (
    <div>
      <h1 className='text-2xl font-bold'>Mi cuenta</h1>
      <p>Acá podrás ver la información de tu cuenta.</p>
      <br/>
      {userData && session?.isLoggedIn && <>
        {!session?.isEntrenador && <>
          <p>Aún no eres un entrenador...</p>
          <a href='/soy-entrenador'>¡Hazte entrenador!</a>
        </>}
        {session?.isEntrenador && <Dashboard userData={userData}/>}
      </>}
    </div>
  );
};
