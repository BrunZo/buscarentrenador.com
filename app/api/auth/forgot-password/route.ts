import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordResetToken } from '@/service/auth/password_reset';
import { sendPasswordResetEmail } from '@/service/auth/email';
import { getUserByEmail } from '@/service/data/users';
import { UserNotFoundError } from '@/service/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'El correo electrónico es requerido' },
        { status: 400 }
      );
    }

    // Generate reset token and send email
    try {
      const user = await getUserByEmail(email);
      const token = await generatePasswordResetToken(email);
      
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        token,
      });

      // Always return success message, even if email doesn't exist (security best practice)
      return NextResponse.json(
        { 
          message: 'Si existe una cuenta con ese correo, recibirás un enlace para resetear tu contraseña'
        },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        // Don't reveal that the user doesn't exist (security best practice)
        return NextResponse.json(
          { 
            message: 'Si existe una cuenta con ese correo, recibirás un enlace para resetear tu contraseña'
          },
          { status: 200 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar tu solicitud. Por favor, intentá de nuevo.' },
      { status: 500 }
    );
  }
}
