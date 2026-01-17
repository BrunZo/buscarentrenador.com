import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/service/auth/password_reset';
import { InvalidResetTokenError, ResetTokenExpiredError } from '@/service/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de reseteo es requerido' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'La nueva contraseña es requerida' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }

    // Reset the password
    await resetPassword(token, password);

    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);

    if (error instanceof InvalidResetTokenError) {
      return NextResponse.json(
        { error: 'Token de reseteo inválido o ya utilizado' },
        { status: 400 }
      );
    }

    if (error instanceof ResetTokenExpiredError) {
      return NextResponse.json(
        { error: 'El token de reseteo ha expirado. Por favor, solicitá uno nuevo.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Ocurrió un error al resetear tu contraseña. Por favor, intentá de nuevo.' },
      { status: 500 }
    );
  }
}
