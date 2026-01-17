import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { updateUser } from "@/service/data/users";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError, UnauthorizedError } from "@/service/errors";

const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  surname: z.string().min(1, "El apellido es requerido").max(255),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();  
    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    const body = await request.json().catch(() => { throw new JsonError(); });
    const { name, surname } = updateUserSchema.parse(body);
    await updateUser(session.user.id, { name, surname });
    return NextResponse.json(
      { message: "Información actualizada correctamente." }, 
      { status: 200 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
