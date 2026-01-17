import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signupUser } from "@/service/auth/signup";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

const signupSchema = z.object({
  email: z.string()
    .email({ message: "El correo electrónico no es válido" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(passwordRegex, {
      message: "La contraseña debe incluir mayúscula, minúscula y número"
    }),
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .regex(nameRegex, { message: "El nombre solo puede contener letras y espacios" }),
  surname: z.string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .regex(nameRegex, { message: "El apellido solo puede contener letras y espacios" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => { throw new JsonError(); });
    const { email, password, name, surname } = signupSchema.parse(body);
    await signupUser(email, password, name, surname);
    return NextResponse.json(
      { message: "Cuenta creada exitosamente. Te enviamos un correo de verificación. Por favor, revisá tu bandeja de entrada." },
      { status: 201 }
    );
  } 
  catch (error) {
    return handleServiceError(error);
  }
}
