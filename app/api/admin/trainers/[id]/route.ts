import { NextRequest, NextResponse } from "next/server";
import { setTrainerStatus } from "@/service/admin";
import { z } from "zod";
import { handleServiceError } from "../../../helper";
import { JsonError, TrainerNotFoundError } from "@/service/errors";

const statusSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const trainerId = Number(id);
    if (!Number.isInteger(trainerId)) throw new TrainerNotFoundError();

    const body = await request.json().catch(() => {
      throw new JsonError();
    });
    const { status } = statusSchema.parse(body);

    await setTrainerStatus(trainerId, status);
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
