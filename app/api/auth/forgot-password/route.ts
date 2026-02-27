import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetToken } from "@/service/auth/password_reset";
import { sendPasswordResetEmail } from "@/service/auth/email";
import { getUserByEmail } from "@/data/users";

const SUCCESS_MESSAGE =
  "Si existe una cuenta con ese correo, recibirás un enlace para resetear tu contraseña";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es requerido" },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(email);

    // Don't reveal whether the email exists (security best practice)
    if (!user) {
      return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
    }

    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      token,
    });

    return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        error:
          "Ocurrió un error al procesar tu solicitud. Por favor, intentá de nuevo.",
      },
      { status: 500 },
    );
  }
}
