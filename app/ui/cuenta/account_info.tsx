import { User } from "next-auth"

export default function AccountInfo({ user }: {
  user: User
}) {
  return (
    <div className='space-y-2 w-full'>
      <h2 className='text-xl font-semibold'>Mi cuenta</h2>
      <p>
        Acá podrás ver la información de tu cuenta.
      </p>
      <p>
        Correo electrónico: {user.email}
      </p>
      <p>
        Nombre: {user.name}
      </p>
      <p>
        Apellido: {user.surname}
      </p>
    </div>
  )
}
