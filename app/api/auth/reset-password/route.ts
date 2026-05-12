import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/service/auth/password_reset';
import { handleServiceError } from '@/app/api/helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token de reseteo es requerido' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    await resetPassword(token, password);

    return NextResponse.json({ message: 'Contraseña actualizada exitosamente' }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
