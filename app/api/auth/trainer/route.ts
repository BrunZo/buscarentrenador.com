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
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  });

  const validation = trainerSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: firstError, details: validation.error.issues },
      { status: 400 }
    );
  }
  const validatedData = validation.data;

  const {
    province,
    city,
    description,
    place = [false, false, false],
    group = [false, false],
    level = [false, false, false, false, false],
    certifications = []
  } = validatedData;

  const existingTrainerResult = await getTrainerByUserId(session.user.id);

  if (existingTrainerResult.success) {
    const updateResult = await updateTrainerProfile(existingTrainerResult.data.id, {
      province: province || undefined,
      city: city || undefined,
      description: description || undefined,
      places: place,
      groups: group,
      levels: level,
      certifications: certifications.length > 0 ? certifications : undefined,
    });

    if (!updateResult.success) {
      let statusCode: number;
      let message: string;

      switch (updateResult.error) {
        case 'not-found':
          statusCode = 404;
          message = "No se encontró el perfil de entrenador.";
          break;
        case 'server-error':
          statusCode = 500;
          message = "Error al actualizar el perfil de entrenador.";
          break;
        default:
          statusCode = 500;
          message = "Error interno del servidor";
      }

      return NextResponse.json(
        { error: updateResult.error, message },
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
        message: "Información de entrenador actualizada exitosamente",
        trainer: updatedTrainerResult.data
      },
      { status: 200 }
    );
  } else {
    const createResult = await createTrainerProfile({
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

    if (!createResult.success) {
      let statusCode: number;
      let message: string;

      switch (createResult.error) {
        case 'server-error':
          statusCode = 500;
          message = "Error al crear el perfil de entrenador.";
          break;
        default:
          statusCode = 500;
          message = "Error interno del servidor";
      }

      return NextResponse.json(
        { error: createResult.error, message },
        { status: statusCode }
      );
    }

    // Fetch the created trainer with user data
    const trainerResult = await getTrainerByUserId(session.user.id);
    if (!trainerResult.success) {
      let statusCode: number;
      let message: string;

      switch (trainerResult.error) {
        case 'not-found':
          statusCode = 404;
          message = "Error al obtener el perfil creado.";
          break;
        case 'server-error':
          statusCode = 500;
          message = "Error al obtener el perfil creado.";
          break;
        default:
          statusCode = 500;
          message = "Error interno del servidor";
      }

      return NextResponse.json(
        { error: trainerResult.error, message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { 
        message: "Información de entrenador guardada exitosamente",
        trainer: trainerResult.data
      },
      { status: 201 }
    );
  }
}
