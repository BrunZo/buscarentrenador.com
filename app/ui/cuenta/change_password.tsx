'use client'

import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import Input from '@/app/ui/form/input'
import Button from '@/app/ui/form/button'
import Message from '@/app/ui/form/message'
import PasswordStrengthIndicator from '@/app/ui/signup/password_strength_indicator'
import { authClient } from '@/service/auth/auth-client'

export default function ChangePassword({ hasPassword }: {
  hasPassword: boolean
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword)
    } else {
      setPasswordMatch(true)
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { error: changeError } = await authClient.changePassword({
        currentPassword,
        newPassword: password,
        revokeOtherSessions,
      })

      if (changeError) {
        if (changeError.status === 429) {
          setError('Demasiados intentos. Intentá de nuevo más tarde.')
        } else if (changeError.code === 'INVALID_PASSWORD') {
          setError('La contraseña actual es incorrecta.')
        } else {
          setError(changeError.message || 'Ocurrió un error. Por favor, intentá de nuevo.')
        }
        return
      }

      setSuccess('Tu contraseña fue actualizada correctamente.')
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setError('Ocurrió un error. Por favor, intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasPassword) {
    return (
      <div className='pt-6 border-t border-gray-200'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Contraseña</h2>
        <p className='text-gray-600 text-sm'>
          Iniciaste sesión con Google, así que no tenés una contraseña para cambiar.
        </p>
      </div>
    )
  }

  return (
    <div className='pt-6 border-t border-gray-200 space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>Cambiar contraseña</h2>
        <p className='text-gray-600'>
          Actualizá la contraseña de tu cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          id='currentPassword'
          type='password'
          name='currentPassword'
          placeholder='Contraseña actual'
          required={true}
          onChange={(e) => setCurrentPassword(e.target.value)}
          value={currentPassword}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Input>

        <div>
          <Input
            id='newPassword'
            type='password'
            name='newPassword'
            placeholder='Nueva contraseña'
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          >
            <LockClosedIcon className='h-5 w-5' />
          </Input>
          {password && (
            <div className='mt-2'>
              <PasswordStrengthIndicator password={password} />
            </div>
          )}
        </div>

        <Input
          id='confirmPassword'
          type='password'
          name='confirmPassword'
          placeholder='Confirmar nueva contraseña'
          required={true}
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          error={!passwordMatch ? 'Las contraseñas no coinciden' : null}
        >
          <LockClosedIcon className='h-5 w-5' />
        </Input>

        <label className='flex items-center gap-2 text-sm text-gray-600'>
          <input
            type='checkbox'
            checked={revokeOtherSessions}
            onChange={(e) => setRevokeOtherSessions(e.target.checked)}
            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
          />
          Cerrar sesión en otros dispositivos
        </label>

        <Button
          text={isLoading ? 'Guardando...' : 'Cambiar contraseña'}
          disabled={isLoading || !passwordMatch || password.length < 8}
        />

        {error && <Message type='error' msg={error} />}
        {success && <Message type='success' msg={success} />}
      </form>
    </div>
  )
}
