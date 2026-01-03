'use client';

import Image from 'next/image'
import { Trainer } from '@/types/trainers'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Info({ trainer, individualProfile }: {
  trainer: Trainer
  individualProfile: boolean
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isContacting, setIsContacting] = useState(false);
  const [error, setError] = useState('');
  
  const handleContact = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    
    setIsContacting(true);
    setError('');
    
    try {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trainerId: trainer.user_id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to messages page with the conversation
        router.push(`/cuenta?tab=1&conversation=${data.conversation.id}`);
      } else {
        setError(data.error || 'Error al crear conversación');
      }
    } catch (err) {
      console.error('Error contacting trainer:', err);
      setError('Error al contactar al entrenador');
    } finally {
      setIsContacting(false);
    }
  };
  
  const image_src = '';
  
  // Check if user can contact this trainer
  const canContact = individualProfile && session && session.user.id !== trainer.user_id;

  return (
    <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
      {image_src ? (
        <div className='shrink-0'>
          <div className='bg-linear-to-br from-indigo-500 to-purple-600 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-medium'>
            <Image
              src={image_src}
              alt='Entrenador'
              width={64}
              height={64}
              className='rounded-full'
            />
          </div>
        </div>
      ) : (
        <div className='shrink-0'>
          <div className='bg-linear-to-br from-indigo-500 to-purple-600 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-medium text-white text-3xl md:text-4xl font-bold'>
            {trainer.name?.charAt(0).toUpperCase() || 'T'}
          </div>
        </div>
      )}
      <div className='flex-1 space-y-6'>
        <div>
          <div className='flex items-start justify-between gap-4 mb-2'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {trainer.name} {trainer.surname}
            </h2>
            {canContact && (
              <button
                onClick={handleContact}
                disabled={isContacting}
                className='shrink-0 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold flex items-center gap-2'
              >
                {isContacting ? (
                  <>
                    <svg className='w-4 h-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                    </svg>
                    Cargando...
                  </>
                ) : (
                  <>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                    </svg>
                    Contactar
                  </>
                )}
              </button>
            )}
          </div>
          {error && (
            <div className='mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs'>
              {error}
            </div>
          )}
          <div className='flex flex-col gap-2 text-gray-600'>
            <div className='flex items-center gap-1'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <span>{trainer.city}, {trainer.province}</span>
            </div>
            {individualProfile && (
              <div className='flex items-center gap-1'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <a href={`mailto:${trainer.email}`} className='text-indigo-600 hover:text-indigo-700 hover:underline'>
                  {trainer.email}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {individualProfile && trainer.description && (
          <div className='pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-2 mb-2'>
             {/* <div className='w-6 h-6 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
              </div>*/}
              <span className='text-sm font-semibold text-gray-700'>Descripción</span>
            </div>
            <p className='text-gray-600 text-sm leading-relaxed'>
              {trainer.description}
            </p>
          </div>
        )}
        
        {individualProfile && trainer.certifications && trainer.certifications.length > 0 && trainer.certifications[0] !== '' && (
          <div className='pt-4'>
            <div className='flex items-center gap-2 mb-2'>
             {/* <div className='w-6 h-6 bg-linear-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
                </svg>
              </div>*/}
              <span className='text-sm font-semibold text-gray-700'>Certificaciones y Logros</span>
            </div>
            <ul className='space-y-2'>
              {trainer.certifications.map((cert, index) => (
                cert.trim() !== '' && (
                  <li key={index} className='flex items-start gap-2 text-sm text-gray-600'>
                    <svg className='w-4 h-4 text-indigo-600 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                    </svg>
                    <span>{cert}</span>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
        
        <div className='space-y-4 pt-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-2'>
             {/* <div className='w-6 h-6 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>*/}
              <span className='text-sm font-semibold text-gray-700'>Ubicación:</span>
              <div className='flex items-center gap-2'>
                <div className='flex flex-wrap gap-2'>
                  {renderChips(trainer.places, ['Virtual', 'A domicilio', 'En dirección particular'])}
                </div>
              </div>
            </div>
          </div>
          
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-2'>
             {/* <div className='w-6 h-6 bg-linear-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
              </div>*/}
              <span className='text-sm font-semibold text-gray-700'>Modalidad:</span>
              <div className='flex items-center gap-2'>
                <div className='flex flex-wrap gap-2'>
                  {renderChips(trainer.groups, ['Individual', 'Grupal'])}
                </div>
              </div>
            </div>
          </div>
          
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-2'>
             {/* <div className='w-6 h-6 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
                </svg>
              </div>*/}
              <span className='text-sm font-semibold text-gray-700'>Nivel:</span>
              <div className='flex items-center gap-2'>
                <div className='flex flex-wrap gap-2'>
                  {renderChips(trainer.levels, ['Ñandú', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Selectivos e internacionales'])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderChips(arr: boolean[], options: string[]) {
  const activeOptions = options.filter((_, i) => arr[i])
  
  if (activeOptions.length === 0) {
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-lg text-sm text-gray-500 bg-gray-100 border border-gray-200'>
        No especificado
      </span>
    )
  }
  
  return (
    <>
      {activeOptions.map((option, i) => (
        <span
          key={i}
          className='inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 shadow-soft'
        >
          {option}
        </span>
      ))}
    </>
  )
}
