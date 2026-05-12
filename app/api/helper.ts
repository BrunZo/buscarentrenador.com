import { NextResponse } from "next/server";
import { AppError } from "@/service/errors";
import { ZodError } from "zod";

export function handleServiceError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
  }

  if (error instanceof AppError) {
    return NextResponse.json({ error: error.clientMessage }, { status: error.statusCode });
  }

  console.error("Unhandled error:", error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
}
