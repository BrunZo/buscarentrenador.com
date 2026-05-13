import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signupUser } from "@/service/auth/signup";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";
import { rateLimiter, RATE_LIMIT_RESPONSE } from "@/service/rate_limiter";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s]+$/;

const signupSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(passwordRegex, {
      message: "La contraseña debe incluir mayúscula, minúscula y número",
    }),
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .regex(nameRegex, {
      message: "El nombre solo puede contener letras, números y espacios",
    }),
  surname: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .regex(nameRegex, {
      message: "El apellido solo puede contener letras, números y espacios",
    }),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (await rateLimiter.check(`signup:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => {
      throw new JsonError();
    });
    const { email, password, name, surname } = signupSchema.parse(body);
    await signupUser(email, password, name, surname);
    return NextResponse.json(
      {
        message:
          "Cuenta creada exitosamente. Te enviamos un correo de verificación. Por favor, revisá tu bandeja de entrada.",
      },
      { status: 201 },
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
