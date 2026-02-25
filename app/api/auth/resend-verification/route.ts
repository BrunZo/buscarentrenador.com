import { NextRequest, NextResponse } from "next/server";
import { resendVerificationEmail } from "@/service/auth/verification_tokens";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { JsonError } from "@/service/errors";

const resendSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido" }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => { throw new JsonError(); });
    const { email } = resendSchema.parse(body);
    await resendVerificationEmail(email);
    return NextResponse.json(
      { message: "Correo de verificación enviado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
