import { Suspense } from 'react';
import ResetPasswordForm from '@/app/ui/auth/reset_password_form';

export default function ResetPasswordPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12'>
      <Suspense fallback={
        <div className='w-full md:w-2/3 lg:w-1/2 space-y-6 bg-white rounded-2xl p-8 shadow-large border border-gray-100'>
          <div className='text-center'>
            <p className='text-gray-600'>Cargando...</p>
          </div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
