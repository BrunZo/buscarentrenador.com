import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { createOrUpdateTrainer } from "@/service/auth/trainers";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError, UnauthorizedError } from "@/service/errors";

const trainerSchema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  places: z.array(z.boolean()).length(3).optional(),
  groups: z.array(z.boolean()).length(2).optional(),
  levels: z.array(z.boolean()).length(5).optional(),
  certifications: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    const body = await request.json().catch(() => { throw new JsonError(); });
    const data = trainerSchema.parse(body);
    const result = await createOrUpdateTrainer(session.user.id, data);
    
    return NextResponse.json(
      { 
        message: result 
          ? "Entrenador creado exitosamente" 
          : "Información de entrenador guardada exitosamente" 
      }, 
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
