import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/next-auth.config";
import { updateUser } from "@/lib/auth/users";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  surname: z.string().min(1, "El apellido es requerido").max(255),
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
    const validatedData = updateUserSchema.parse(body);

    const user = await updateUser(session.user.id, validatedData);
    if (!user) {
      return NextResponse.json(
        { error: "No se encontró el usuario." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Información actualizada correctamente." }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: firstError, details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intentá de nuevo." },
      { status: 500 }
    );
  }
}
