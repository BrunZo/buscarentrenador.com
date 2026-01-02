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
            'w-full flex justify-center items-center py-3 px-6': true,
            'border border-transparent rounded-lg text-base font-semibold text-white': true,
            'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700': !isDisabled,
            'bg-gray-300 cursor-not-allowed': isDisabled,
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': true,
            'shadow-medium hover:shadow-large transition-all duration-200': true,
            'transform hover:scale-[1.02] active:scale-[0.98]': !isDisabled,
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