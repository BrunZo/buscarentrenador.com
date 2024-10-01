import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Message({
  type,
  msg 
}: { 
  type: 'error' | 'success' | 'info' | 'warning'
  msg?: string 
}) {
  return (
    <div
      className='flex items-center h-8 items-end space-x-1'
      aria-live='polite'
      aria-atomic='true'
    >
      {msg && (
        <>
          {type === 'error' && <ExclamationCircleIcon className='h-5 w-5 text-red-500' />}
          {type === 'success' && <CheckCircleIcon className='h-5 w-5 text-green-500' />}
          {type === 'info' && <ExclamationCircleIcon className='h-5 w-5 text-blue-500' />}
          {type === 'warning' && <ExclamationCircleIcon className='h-5 w-5 text-yellow-500' />}
          <p className={clsx(
            'text-sm',
            type === 'error' && 'text-red-500',
            type === 'success' && 'text-green-500',
            type === 'info' && 'text-blue-500',
            type === 'warning' && 'text-yellow-500'
          )}>{msg}</p>
        </>
      )}
    </div>
  )
}