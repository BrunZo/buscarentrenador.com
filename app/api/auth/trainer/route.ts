import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { getTrainerByUserId, updateTrainer } from "@/service/data/trainers";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError, UnauthorizedError } from "@/service/errors";

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
      throw new UnauthorizedError();
    }

    const body = await request.json().catch(() => { throw new JsonError(); });
    const data = trainerSchema.parse(body);
    const trainer = await getTrainerByUserId(session.user.id);
    await updateTrainer(trainer.id, data);
    return NextResponse.json({ message: "Información de entrenador guardada exitosamente" }, { status: 201 });
  } catch (error) {
    return handleServiceError(error);
  }
}
