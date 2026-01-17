import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/service/auth/login";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";

const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => { throw new JsonError(); });
    const { email, password } = loginSchema.parse(body);
    await verifyLogin(email, password);
    return NextResponse.json({ message: "Inicio de sesión exitoso" }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
