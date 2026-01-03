import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/service/auth/next-auth.config";
import { updateUser } from "@/service/auth/users";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  surname: z.string().min(1, "El apellido es requerido").max(255),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => {
    return NextResponse.json(
      { error: "Cuerpo de solicitud inválido" },
      { status: 400 }
    );
  });

  const validation = updateUserSchema.safeParse(body);
  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Datos de entrada inválidos";
    return NextResponse.json(
      { error: firstError, details: validation.error.issues },
      { status: 400 }
    );
  }
  const validatedData = validation.data;

  const result = await updateUser(session.user.id, validatedData);
  if (!result.success) {
    let statusCode: number;
    let message: string;

    switch (result.error) {
      case 'not-found':
        statusCode = 404;
        message = "No se encontró el usuario.";
        break;
      case 'server-error':
        statusCode = 500;
        message = "Error interno del servidor. Por favor, intentá de nuevo.";
        break;
      default:
        statusCode = 500;
        message = "Error interno del servidor";
    }

    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }

  return NextResponse.json(
    { message: "Información actualizada correctamente." }, 
    { status: 200 }
  );
}
