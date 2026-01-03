import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/next-auth.config";
import { getTrainerByUserId, setTrainerVisibility } from "@/lib/data/trainers";
import { z } from "zod";

const visibilitySchema = z.object({
  is_visible: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = visibilitySchema.parse(body);

    const existingTrainer = await getTrainerByUserId(session.user.id);

    if (!existingTrainer) {
      return NextResponse.json(
        { error: "No se encontró el perfil de entrenador." },
        { status: 404 }
      );
    }

    const trainer = await setTrainerVisibility(existingTrainer.id, validatedData.is_visible);

    if (!trainer) {
      return NextResponse.json(
        { error: "Error al actualizar la visibilidad del perfil." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: validatedData.is_visible 
          ? "Tu perfil ahora es visible para los usuarios." 
          : "Tu perfil ha sido ocultado de las búsquedas.",
        trainer
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: firstError, details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error in trainer visibility route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intentá de nuevo." },
      { status: 500 }
    );
  }
}
