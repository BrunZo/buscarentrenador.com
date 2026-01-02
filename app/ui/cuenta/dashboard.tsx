'use client'

import { useState } from 'react'
import { Trainer } from '@/types/trainers'
import { User } from 'next-auth'
import AccountInfo from '@/app/ui/cuenta/account_info'
import VerticalNavbar from '@/app/ui/cuenta/vertical_navbar'
import TrainerProfile from '@/app/ui/cuenta/trainer_profile'
import Students from '@/app/ui/cuenta/students'

export default function Dashboard({ user, trainer }: {
  user: User,
  trainer: Trainer | null
}) {
  const [selected, setSelected] = useState(0)

  const options = ['Mi cuenta']
  if (trainer) {
    options.push('Perfil de entrenador')
    options.push('Mis alumnos')
  }

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <VerticalNavbar
        options={options}
        selected={selected}
        handler={setSelected}
      />
      <div className='flex-1 min-w-0'>
        <div className='bg-white rounded-2xl shadow-large border border-gray-100 p-6 md:p-8'>
          {selected === 0 && <AccountInfo user={user}/>}
          {trainer && selected === 1 && <TrainerProfile trainer={trainer}/>}
          {trainer && selected === 2 && <Students />}
        </div>
      </div>
    </div>
  )
}
