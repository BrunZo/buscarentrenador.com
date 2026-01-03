import { NextRequest, NextResponse } from "next/server";
import { generateVerificationToken } from "@/lib/auth/verification_tokens";
import { getUserByEmail } from "@/lib/auth/users";
import { sendVerificationEmail } from "@/lib/auth/email";
import { z } from "zod";

const resendSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  }

  const validation = resendSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: firstError },
      { status: 400 }
    );
  }

  const { email } = validation.data;

  const userResult = await getUserByEmail(email);
  if (!userResult.success) {
    let statusCode: number;
    let message: string;

    switch (userResult.error) {
      case 'not-found':
        statusCode = 404;
        message = "No existe una cuenta con este correo electrónico";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error interno del servidor. Por favor, intentá de nuevo.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: userResult.error, message },
      { status: statusCode }
    );
  }

  if (userResult.data.email_verified) {
    return NextResponse.json(
      { error: "El correo ya está verificado" },
      { status: 400 }
    );
  }

  const tokenResult = await generateVerificationToken(email);

  if (!tokenResult.success) {
    let statusCode: number;
    let message: string;

    switch (tokenResult.error) {
      case 'user-not-found':
        statusCode = 404;
        message = "Usuario no encontrado";
        break;
      case 'already-verified':
        statusCode = 400;
        message = "El correo ya está verificado";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error al generar el token de verificación";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: tokenResult.error, message },
      { status: statusCode }
    );
  }

  const emailResult = await sendVerificationEmail({
    email: userResult.data.email,
    name: userResult.data.name,
    token: tokenResult.data.token,
  });

  if (!emailResult.success) {
    console.error('Failed to send verification email:', emailResult.error);
    let statusCode: number;
    let message: string;

    switch (emailResult.error) {
      case 'server-error':
        statusCode = 500;
        message = "Error al enviar el correo de verificación. Por favor, intentá de nuevo más tarde.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: emailResult.error, message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { message: "Correo de verificación enviado exitosamente" },
    { status: 200 }
  );
}
