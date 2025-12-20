import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import pool from "@/lib/db";
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

    const client = await pool.connect();
    
    try {
      const existingTrainer = await client.query(
        "SELECT id FROM trainers WHERE user_id = $1",
        [session.user.id]
      );

      const {
        province = null,
        city = null,
        description = null,
        place = [false, false, false],
        group = [false, false],
        level = [false, false, false, false, false],
        certifications = []
      } = validatedData;

      if (existingTrainer.rows.length > 0) {
        const trainerId = existingTrainer.rows[0].id;
        
        const updateQuery = `
          UPDATE trainers 
          SET 
            province = COALESCE($1, province),
            city = COALESCE($2, city),
            description = COALESCE($3, description),
            places = COALESCE($4::boolean[], places),
            groups = COALESCE($5::boolean[], groups),
            levels = COALESCE($6::boolean[], levels),
            certifications = COALESCE($7::text[], certifications),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $8
          RETURNING *
        `;

        const result = await client.query(updateQuery, [
          province,
          city,
          description,
          place,
          group,
          level,
          certifications,
          trainerId
        ]);

        return NextResponse.json(
          { 
            message: "Información de entrenador actualizada exitosamente",
            trainer: result.rows[0]
          },
          { status: 200 }
        );
      } else {
        const insertQuery = `
          INSERT INTO trainers (
            user_id,
            province,
            city,
            description,
            places,
            groups,
            levels,
            certifications
          )
          VALUES ($1, $2, $3, $4, $5::boolean[], $6::boolean[], $7::boolean[], $8::text[])
          RETURNING *
        `;

        const result = await client.query(insertQuery, [
          session.user.id,
          province,
          city,
          description,
          place,
          group,
          level,
          certifications
        ]);

        return NextResponse.json(
          { 
            message: "Información de entrenador guardada exitosamente",
            trainer: result.rows[0]
          },
          { status: 201 }
        );
      }
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
