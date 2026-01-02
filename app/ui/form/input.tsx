'use client'

import clsx from 'clsx';
import { ChangeEvent, ReactNode } from 'react'
import { useFormStatus } from 'react-dom';

export default function Input({ id, type, name, placeholder, required, children, onChange, error, value } : {
  id: string,
  type: string,
  name: string,
  placeholder: string,
  required?: boolean,
  children: ReactNode,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  error?: string | null,
  value?: string
}) {
  const { pending } = useFormStatus();
  
  return (
    <div className='flex flex-col mb-4'>
      <div className='relative flex w-full'>
        <label
          htmlFor={id}
          className='sr-only'
        >
          {placeholder}
        </label>
        <input
          className={clsx({
            'peer block w-full rounded-lg py-3 pl-10 pr-4': true,
            'border border-gray-300 text-sm outline-none placeholder:text-gray-400': true,
            'bg-white focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200': true,
            'hover:border-gray-400 transition-all duration-200': true,
            'disabled:bg-gray-100 disabled:cursor-not-allowed': pending,
            'border-red-300 focus:border-red-500 focus:ring-red-200': error,
          })}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          aria-disabled={pending}
          disabled={pending}
          onChange={onChange}
          value={value}
        />
        <div className={clsx({
          'absolute left-3 top-1/2 -translate-y-1/2': true,
          'text-gray-400 peer-focus:text-indigo-600 transition-colors duration-200': true,
          'text-red-400': error,
        })}>
          { children }
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
