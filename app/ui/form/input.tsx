'use client'

import clsx from 'clsx';
import { ChangeEvent, ReactNode } from 'react'
import { useFormStatus } from 'react-dom';

export default function Input({ id, type, name, placeholder, required, children, onChange, error } : {
  id: string,
  type: string,
  name: string,
  placeholder: string,
  required?: boolean,
  children: ReactNode,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  error?: string | null
}) {
  const { pending } = useFormStatus();
  
  return (
    <div className='flex flex-col  mb-4'>
      <div className='relative flex w-full'>
        <label
          htmlFor={id}
          className='sr-only'
        >
          Usuario
        </label>
        <input
          className={clsx({
            'peer block w-full rounded-md py-[9px] pl-10': true,
            'border border-gray-200 text-sm outline-2 placeholder:text-gray-500': true,
            'disabled': pending
          })}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          aria-disabled={pending}
          disabled={pending}
          onChange={onChange}
        />
        { children }
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
