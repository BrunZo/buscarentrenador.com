import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { updateTrainerVisibility } from "@/service/auth/trainers";
import { z } from "zod";
import { handleServiceError } from "../../../helper";
import { JsonError, UnauthorizedError } from "@/service/errors";

const visibilitySchema = z.object({
  is_visible: z.boolean(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    const body = await request.json().catch(() => { throw new JsonError(); });
    const { is_visible } = visibilitySchema.parse(body);
    await updateTrainerVisibility(session.user.id, is_visible);
    return NextResponse.json(
      { message: is_visible ? "Tu perfil ahora es visible para los usuarios." : "Tu perfil ha sido ocultado de las búsquedas." },
      { status: 200 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
