'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleSignInButton({ label = 'Continuar con Google' }: { label?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    let willRedirect = false;

    try {
      const result = await signIn('google', { callbackUrl: '/cuenta', redirect: false });

      if (result?.error) {
        willRedirect = true;
        router.push(`/login?error=${encodeURIComponent(result.error)}`);
        return;
      }

      if (result?.url) {
        try {
          const redirectUrl = new URL(result.url, window.location.origin);
          if (redirectUrl.origin === window.location.origin) {
            willRedirect = true;
            router.push(`${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`);
            return;
          }
        } catch {
          // Fall through to generic error redirect below.
        }
      }

      willRedirect = true;
      router.push('/login?error=unexpected_signin_response');
      return;
    } finally {
      if (!willRedirect) {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isLoading}
      className='w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold shadow-medium hover:shadow-large hover:bg-gray-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
    >
      <svg className='h-5 w-5' viewBox='0 0 24 24' aria-hidden='true'>
        <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z'/>
        <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/>
        <path fill='#FBBC05' d='M5.84 14.12A6.93 6.93 0 0 1 5.45 12c0-.74.13-1.45.36-2.12V7.04H2.18A10.99 10.99 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.66-2.84z'/>
        <path fill='#EA4335' d='M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z'/>
      </svg>
      {isLoading ? 'Redirigiendo...' : label}
    </button>
  );
}
