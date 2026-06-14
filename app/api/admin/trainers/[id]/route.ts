import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/service/auth/auth";
import { updateTrainer } from "@/service/trainers";
import { z } from "zod";
import { handleServiceError } from "../../../helper";
import {
  JsonError,
  TrainerNotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "@/service/errors";

const statusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new UnauthorizedError();
    if (session.user.role !== "admin") throw new ForbiddenError();

    const { id } = await params;
    const trainerId = Number(id);
    if (!Number.isInteger(trainerId)) throw new TrainerNotFoundError();

    const body = await request.json().catch(() => {
      throw new JsonError();
    });
    const { status } = statusSchema.parse(body);

    const updated = await updateTrainer(trainerId, { status });
    if (!updated) throw new TrainerNotFoundError();
    return NextResponse.json(
      {
        message:
          status === "approved"
            ? "Entrenador aprobado."
            : "Entrenador rechazado.",
      },
      { status: 200 },
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
