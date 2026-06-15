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
      className={clsx(
        'flex flex-row items-start gap-3 p-4 rounded-lg border',
        type === 'error' && 'bg-red-50 border-red-200',
        type === 'success' && 'bg-green-50 border-green-200',
        type === 'info' && 'bg-blue-50 border-blue-200',
        type === 'warning' && 'bg-yellow-50 border-yellow-200'
      )}
      aria-live='polite'
      aria-atomic='true'
    >
      {msg && (
        <>
          {type === 'error' && <ExclamationCircleIcon className='h-5 w-5 text-red-600 flex-shrink-0 mt-0.5' />}
          {type === 'success' && <CheckCircleIcon className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />}
          {type === 'info' && <ExclamationCircleIcon className='h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5' />}
          {type === 'warning' && <ExclamationCircleIcon className='h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5' />}
          <p className={clsx(
            'text-sm font-medium',
            type === 'error' && 'text-red-800',
            type === 'success' && 'text-green-800',
            type === 'info' && 'text-blue-800',
            type === 'warning' && 'text-yellow-800'
          )}>{msg}</p>
        </>
      )}
    </div>
  )
}