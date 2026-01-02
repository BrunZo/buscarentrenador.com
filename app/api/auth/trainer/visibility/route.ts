import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
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

    const client = await pool.connect();
    
    try {
      // Find the trainer by user_id
      const trainerResult = await client.query(
        "SELECT id FROM trainers WHERE user_id = $1",
        [session.user.id]
      );

      if (trainerResult.rows.length === 0) {
        return NextResponse.json(
          { error: "No se encontró el perfil de entrenador." },
          { status: 404 }
        );
      }

      const trainerId = trainerResult.rows[0].id;

      // Update visibility
      const updateResult = await client.query(
        `UPDATE trainers 
         SET is_visible = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING *`,
        [validatedData.is_visible, trainerId]
      );

      return NextResponse.json(
        { 
          message: validatedData.is_visible 
            ? "Tu perfil ahora es visible para los usuarios." 
            : "Tu perfil ha sido ocultado de las búsquedas.",
          trainer: updateResult.rows[0]
        },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: firstError, details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intentá de nuevo." },
      { status: 500 }
    );
  }
}
