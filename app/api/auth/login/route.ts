import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import pool from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "MISSING_CREDENTIALS", message: "Por favor, completá todos los campos" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, email, password_hash, name, surname, email_verified FROM users WHERE email = $1",
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        return NextResponse.json(
          { error: "INVALID_CREDENTIALS", message: "Correo electrónico o contraseña incorrectos" },
          { status: 401 }
        );
      }

      const isPasswordValid = await compare(password, user.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "INVALID_CREDENTIALS", message: "Correo electrónico o contraseña incorrectos" },
          { status: 401 }
        );
      }

      // Check if email is verified
      if (!user.email_verified) {
        return NextResponse.json(
          { error: "EMAIL_NOT_VERIFIED", message: "Tu correo electrónico no está verificado" },
          { status: 403 }
        );
      }

      // Return success - the actual sign in will be done by NextAuth
      return NextResponse.json(
        { 
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
          }
        },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
