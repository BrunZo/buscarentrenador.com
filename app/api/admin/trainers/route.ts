import { NextRequest, NextResponse } from "next/server";
import { listTrainersForAdmin } from "@/service/admin";
import { z } from "zod";
import { handleServiceError } from "../../helper";

const statusSchema = z
  .enum(["pending", "approved", "rejected"])
  .optional();

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new UnauthorizedError();
    if (session.user.role !== "admin") throw new ForbiddenError();
    
    const statusParam = request.nextUrl.searchParams.get("status") ?? undefined;
    const status = statusSchema.parse(statusParam);

    const trainers = await listTrainersForAdmin(status);
    return NextResponse.json({ trainers }, { status: 200 });
  } catch (error) {
    return handleServiceError(error);
  }
}
