import { NextRequest, NextResponse } from "next/server";
import { verifyLogin } from "@/service/auth/login";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";
import { isRateLimited, RATE_LIMIT_RESPONSE } from "@/service/ratelimit";

const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => { throw new JsonError(); });
    const { email, password } = loginSchema.parse(body);
    await verifyLogin(email, password);
    return NextResponse.json({ message: "Inicio de sesión exitoso" }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
