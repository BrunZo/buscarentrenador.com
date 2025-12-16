import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/auth";
import { z } from "zod";

// Regex para validación de contraseña fuerte
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

// Regex para nombre/apellido (solo letras y espacios)
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

const signupSchema = z.object({
  email: z.string()
    .email({ message: "El correo electrónico no es válido" }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .regex(passwordRegex, { 
      message: "La contraseña debe incluir mayúscula, minúscula, número y carácter especial (!@#$%^&*)" 
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
    const body = await request.json();
    const { email, password, name, surname } = signupSchema.parse(body);

    // Verificar si el usuario ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este correo electrónico" },
        { status: 400 }
      );
    }

    // Crear nuevo usuario
    const user = await createUser(email, password, name, surname);

    return NextResponse.json(
      { 
        message: "Cuenta creada exitosamente",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extraer el primer mensaje de error para mostrarlo al usuario
      const firstError = error.issues[0]?.message || "Datos de entrada inválidos";
      return NextResponse.json(
        { error: firstError, details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, intentá de nuevo." },
      { status: 500 }
    );
  }
}
