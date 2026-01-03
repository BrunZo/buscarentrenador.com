import { NextRequest, NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/auth/verification_tokens";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) {
    return NextResponse.json(
      { error: "Token no proporcionado" },
      { status: 400 }
    );
  }

  const result = await verifyUserEmail(token);
  if (!result.success) {
    let statusCode: number;
    let message: string;

    switch (result.error) {
      case 'invalid-token':
        statusCode = 400;
        message = "Token inválido";
        break;
      case 'already-verified':
        statusCode = 400;
        message = "El correo ya está verificado";
        break;
      case 'token-expired':
        statusCode = 400;
        message = "El token ha expirado";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error interno del servidor. Por favor, intentá de nuevo.";
        break;
    }

    return NextResponse.json(
      { error: result.error, message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { message: "Correo verificado exitosamente" },
    { status: 200 }
  );
}
