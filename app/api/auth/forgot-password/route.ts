import { NextRequest, NextResponse } from "next/server";
import { generatePasswordResetToken } from "@/service/auth/password_reset";
import { mailer } from "@/service/mailer";
import { getUserByEmail } from "@/service/users";
import { rateLimiter, RATE_LIMIT_RESPONSE } from "@/service/rate_limiter";

const SUCCESS_MESSAGE =
  "Si existe una cuenta con ese correo, recibirás un enlace para resetear tu contraseña";

// Minimum response time in ms — masks the timing difference between known and unknown emails.
const MIN_RESPONSE_MS = 800;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (await rateLimiter.check(`forgot-password:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }

  const started = Date.now();

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

    if (user) {
      const token = await generatePasswordResetToken(email);
      await mailer.sendPasswordReset(user.email, user.name, token);
    }

    const elapsed = Date.now() - started;
    if (elapsed < MIN_RESPONSE_MS) {
      await new Promise(r => setTimeout(r, MIN_RESPONSE_MS - elapsed));
    }

    return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar tu solicitud. Por favor, intentá de nuevo." },
      { status: 500 },
    );
  }
}
