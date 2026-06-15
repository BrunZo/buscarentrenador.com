import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/service/auth/auth";
import { getTrainersByFilters } from "@/service/trainers";
import { z } from "zod";
import { handleServiceError } from "../../helper";
import { UnauthorizedError, ForbiddenError } from "@/service/errors";

const statusSchema = z
  .enum(["pending", "approved", "rejected"])
  .default("pending");

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new UnauthorizedError();
    if (session.user.role !== "admin") throw new ForbiddenError();

    const statusParam = request.nextUrl.searchParams.get("status") ?? undefined;
    const status = statusSchema.parse(statusParam);

    // require_visible: false so admins see trainers regardless of their
    // personal visibility toggle; no place/group/level narrowing.
    const trainers = await getTrainersByFilters({
      places: [],
      groups: [],
      levels: [],
      require_visible: false,
      status,
      include_email: true,
    });
    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
