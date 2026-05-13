import { NextRequest, NextResponse } from "next/server";
import { resendVerificationEmail } from "@/service/auth/verification_tokens";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";
import { rateLimiter, RATE_LIMIT_RESPONSE } from "@/service/rate_limiter";

const resendSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
});

const SUCCESS_RESPONSE = {
  message:
    "Si el correo está registrado y no fue verificado, te enviamos un nuevo enlace de verificación.",
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await rateLimiter.check(`resend-verification:${ip}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }

  try {
    const body = await request.json().catch(() => { throw new JsonError(); });
    const { email } = resendSchema.parse(body);

    const cooldownHit = await rateLimiter.check(
      `resend-verification-email:${email}`,
      1,
      60 * 1000,
    );
    if (!cooldownHit) {
      try {
        await resendVerificationEmail(email);
      } catch {}
    }

    return NextResponse.json(SUCCESS_RESPONSE, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
