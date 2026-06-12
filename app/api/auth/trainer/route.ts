import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/service/auth/auth";
import { createOrUpdateTrainer } from "@/service/trainers";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError, UnauthorizedError } from "@/service/errors";

const trainerSchema = z.object({
  province: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  places: z.array(z.boolean()).length(3).optional(),
  groups: z.array(z.boolean()).length(3).optional(),
  levels: z.array(z.boolean()).length(5).optional(),
  certifications: z.array(z.string()).optional(),
  soy_exo: z.boolean().optional(),
  examenes_oma: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    const body = await request.json().catch(() => { throw new JsonError(); });
    const data = trainerSchema.parse(body);
    await createOrUpdateTrainer(session.user.id, data);

    return NextResponse.json(
      { message: "Información de entrenador guardada exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
