import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/service/auth/password_reset';
import { handleServiceError } from '@/app/api/helper';
import { rateLimiter, RATE_LIMIT_RESPONSE } from '@/service/rate_limiter';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (await rateLimiter.check(`reset-password:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }

  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token de reseteo es requerido' }, { status: 400 });
    }

    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula y número' },
        { status: 400 }
      );
    }

    await resetPassword(token, password);

    return NextResponse.json({ message: 'Contraseña actualizada exitosamente' }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
