'use client'

import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

export default function Button({ text, disabled }: {
  text: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;
  
  return (
    <>
      <div className='flex'>
        <button
          type='submit'
          className={clsx({
            'w-full flex justify-center py-2 px-4': true,
            'border border-transparent rounded-md shadow-sm text-sm font-medium text-white': true,
            'bg-indigo-600 hover:bg-indigo-700': !isDisabled,
            'bg-indigo-200': isDisabled,
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true
          })}
          aria-disabled={isDisabled}
          disabled={isDisabled}
        >
          { text }
        </button>
      </div>
    </>
  )
}