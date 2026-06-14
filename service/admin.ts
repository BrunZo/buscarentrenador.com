import { headers } from "next/headers";
import { auth } from "@/service/auth/auth";
import {
  getTrainersForAdmin,
  updateTrainerStatus,
} from "@/service/trainers";
import { ForbiddenError, UnauthorizedError } from "@/service/errors";
import type { TrainerWithEmail, TrainerStatus } from "@/types/trainers";

/**
 * Ensures the current request comes from an admin.
 * Better Auth sessions are backed by the database, so the role reflects the
 * current value (a demoted admin loses access immediately).
 * @throws UnauthorizedError - if there is no session
 * @throws ForbiddenError - if the user is not an admin
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new UnauthorizedError();
  if (session.user.role !== "admin") throw new ForbiddenError();

  return session.user;
}

export async function listTrainersForAdmin(
  status?: TrainerStatus,
): Promise<TrainerWithEmail[]> {
  await requireAdmin();
  return getTrainersForAdmin(status);
}

export async function setTrainerStatus(
  trainerId: number,
  status: TrainerStatus,
): Promise<{ id: number }> {
  await requireAdmin();
  return updateTrainerStatus(trainerId, status);
}
