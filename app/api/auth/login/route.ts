import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/service/auth/users";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  });

  const validation = loginSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: "MISSING_CREDENTIALS", message: firstError },
      { status: 400 }
    );
  }

  const { email, password } = validation.data;

  const result = await verifyLogin(email, password);
  if (!result.success) {
    let statusCode: number;
    let message: string;

    switch (result.error) {
      case 'invalid-credentials':
        statusCode = 401;
        message = "Correo electrónico o contraseña incorrectos";
        break;
      case 'email-not-verified':
        statusCode = 403;
        message = "Tu correo electrónico no está verificado";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error interno del servidor";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }
    
    return NextResponse.json(
      { error: result.error, message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { user: result.data },
    { status: 200 }
  );
}
