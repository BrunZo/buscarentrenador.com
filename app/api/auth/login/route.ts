import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/lib/auth/users";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const result = await verifyLogin(email, password);

    if (!result.success && result.error) {
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
      { 
        success: true,
        user: result.user
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: "MISSING_CREDENTIALS", message: firstError },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
