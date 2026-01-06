import { NextRequest, NextResponse } from "next/server";
import { verifyUserEmail } from "@/service/auth/verification_tokens";
import { handleServiceError } from "../../helper";
import { InvalidTokenError } from "@/service/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) {
      throw new InvalidTokenError();
    }

    await verifyUserEmail(token);
    return NextResponse.json(
      { message: "Correo verificado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    return handleServiceError(error);
  }
}
