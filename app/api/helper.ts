import { NextResponse } from "next/server";
import { 
  UserNotFoundError, 
  InvalidCredentialsError, 
  EmailNotVerifiedError,
  AlreadyVerifiedError,
  InvalidTokenError,
  TokenExpiredError,
  TrainerNotFoundError,
  ServerError,
  JsonError,
  UnauthorizedError,
  EmailAlreadyInUseError
} from "@/service/errors";
import { ZodError } from "zod";

export function handleServiceError(error: unknown): NextResponse {
  
  if (error instanceof JsonError) {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message },
      { status: 400 }
    );
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  if (error instanceof UserNotFoundError) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }
  
  if (error instanceof InvalidCredentialsError) {
    return NextResponse.json(
      { error: "Correo electrónico o contraseña incorrectos" },
      { status: 401 }
    );
  }
  
  if (error instanceof EmailNotVerifiedError) {
    return NextResponse.json(
      { error: "Tu correo electrónico no está verificado" },
      { status: 403 }
    );
  }
  
  if (error instanceof AlreadyVerifiedError) {
    return NextResponse.json(
      { error: "El correo ya está verificado" },
      { status: 400 }
    );
  }

  if (error instanceof EmailAlreadyInUseError) {
    return NextResponse.json(
      { error: "El correo electrónico ya está en uso" },
      { status: 400 }
    );
  }
  
  if (error instanceof InvalidTokenError) {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 400 }
    );
  }
  
  if (error instanceof TokenExpiredError) {
    return NextResponse.json(
      { error: "El token ha expirado" },
      { status: 400 }
    );
  }
  
  if (error instanceof TrainerNotFoundError) {
    return NextResponse.json(
      { error: "No se encontró el perfil de entrenador" },
      { status: 404 }
    );
  }
  
  if (error instanceof ServerError) {
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
  
  console.error("Unhandled error:", error);
  return NextResponse.json(
    { error: "Error interno del servidor" },
    { status: 500 }
  );
}