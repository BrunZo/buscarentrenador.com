import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/service/auth/users";
import { sendVerificationEmail } from "@/service/auth/email";
import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

const signupSchema = z.object({
  email: z.string()
    .email({ message: "El correo electrónico no es válido" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(passwordRegex, {
      message: "La contraseña debe incluir mayúscula, minúscula, número y carácter especial (!@#$%^&*)"
    }),
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .regex(nameRegex, { message: "El nombre solo puede contener letras y espacios" }),
  surname: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .regex(nameRegex, { message: "El apellido solo puede contener letras y espacios" }),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    )
  });
  const validation = signupSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: firstError, details: validation.error.issues },
      { status: 400 }
    );
  }

  const { email, password, name, surname } = validation.data;

  const existingUserResult = await getUserByEmail(email);
  if (existingUserResult.success) {
    return NextResponse.json(
      { error: "Ya existe una cuenta con este correo electrónico" },
      { status: 400 }
    );
  }

  const userResult = await createUser(email, password, name, surname);
  if (!userResult.success) {
    let statusCode: number;
    let message: string;

    switch (userResult.error) {
      case 'server-error':
        statusCode = 500;
        message = "Error al crear la cuenta. Por favor, intentá de nuevo.";
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

  const emailResult = await sendVerificationEmail({
    email: email,
    name: name,
    token: userResult.data.verification_token,
  });

  if (!emailResult.success) {
    console.error('Failed to send verification email:', emailResult.error);
    let statusCode: number;
    let message: string;

    switch (emailResult.error) {
      case 'server-error':
        statusCode = 500;
        message = "Cuenta creada exitosamente, pero hubo un problema al enviar el correo de verificación. Por favor, solicitá un reenvío.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    {
      message: "Cuenta creada exitosamente. Te enviamos un correo de verificación. Por favor, revisá tu bandeja de entrada.",
      user: {
        id: userResult.data.user_id,
        email: email,
        name: name,
        surname: surname,
      }
    },
    { status: 201 }
  );
}
