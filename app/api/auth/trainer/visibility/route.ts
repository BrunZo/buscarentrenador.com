import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { getTrainerByUserId, setTrainerVisibility } from "@/service/data/trainers";
import { z } from "zod";

const visibilitySchema = z.object({
  is_visible: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  }

  const validation = visibilitySchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: firstError, details: validation.error.issues },
      { status: 400 }
    );
  }

  const validatedData = validation.data;

  const existingTrainerResult = await getTrainerByUserId(session.user.id);

  if (!existingTrainerResult.success) {
    let statusCode: number;
    let message: string;

    switch (existingTrainerResult.error) {
      case 'not-found':
        statusCode = 404;
        message = "No se encontró el perfil de entrenador.";
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
      { error: existingTrainerResult.error, message },
      { status: statusCode }
    );
  }

  const visibilityResult = await setTrainerVisibility(existingTrainerResult.data.id, validatedData.is_visible);

  if (!visibilityResult.success) {
    let statusCode: number;
    let message: string;

    switch (visibilityResult.error) {
      case 'not-found':
        statusCode = 404;
        message = "No se encontró el perfil de entrenador.";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error al actualizar la visibilidad del perfil.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: visibilityResult.error, message },
      { status: statusCode }
    );
  }

  const updatedTrainerResult = await getTrainerByUserId(session.user.id);
  if (!updatedTrainerResult.success) {
    let statusCode: number;
    let message: string;

    switch (updatedTrainerResult.error) {
      case 'not-found':
        statusCode = 404;
        message = "Error al obtener el perfil actualizado.";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error al obtener el perfil actualizado.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: updatedTrainerResult.error, message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { 
      message: validatedData.is_visible 
        ? "Tu perfil ahora es visible para los usuarios." 
        : "Tu perfil ha sido ocultado de las búsquedas.",
      trainer: updatedTrainerResult.data
    },
    { status: 200 }
  );
}
