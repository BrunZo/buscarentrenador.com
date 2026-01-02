'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    if (term)
      params.set('query', term)
    else
      params.delete('query')
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className='relative flex w-full'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 hover:border-gray-400 transition-all duration-200'
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-600 transition-colors duration-200' />
    </div>
  );
}
