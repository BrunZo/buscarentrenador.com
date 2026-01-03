import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/next-auth.config";
import { createTrainerProfile, updateTrainerProfile, getTrainerByUserId } from "@/lib/data/trainers";
import { z } from "zod";

const trainerSchema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  place: z.array(z.boolean()).length(3).optional(),
  group: z.array(z.boolean()).length(2).optional(),
  level: z.array(z.boolean()).length(5).optional(),
  certifications: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = trainerSchema.parse(body);

    const {
      province,
      city,
      description,
      place = [false, false, false],
      group = [false, false],
      level = [false, false, false, false, false],
      certifications = []
    } = validatedData;

    const existingTrainer = await getTrainerByUserId(session.user.id);

    if (existingTrainer) {
      const trainer = await updateTrainerProfile(existingTrainer.id, {
        province: province || undefined,
        city: city || undefined,
        description: description || undefined,
        places: place,
        groups: group,
        levels: level,
        certifications: certifications.length > 0 ? certifications : undefined,
      });

      if (!trainer) {
        return NextResponse.json(
          { error: "Error al actualizar el perfil de entrenador." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { 
          message: "Información de entrenador actualizada exitosamente",
          trainer
        },
        { status: 200 }
      );
    } else {
      const trainer = await createTrainerProfile({
        user_id: session.user.id,
        province: province || null,
        city: city || null,
        description: description || null,
        places: place,
        groups: group,
        levels: level,
        certifications: certifications,
        hourly_rate: null,
      });

      return NextResponse.json(
        { 
          message: "Información de entrenador guardada exitosamente",
          trainer
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: firstError, details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error in trainer route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intentá de nuevo." },
      { status: 500 }
    );
  }
}
