'use client'

import clsx from 'clsx';
import { ChangeEvent, ReactNode } from 'react'
import { useFormStatus } from 'react-dom';

export default function Input({ id, type, name, placeholder, required, children, onChange } : {
  id: string,
  type: string,
  name: string,
  placeholder: string,
  required?: boolean,
  children: ReactNode,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const { pending } = useFormStatus();
  
  return (
    <div className='relative flex w-full mb-4'>
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
  )
}
