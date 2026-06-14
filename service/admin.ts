import { auth } from "@/service/auth/next-auth.config";
import { getUserById } from "@/service/users";
import {
  getTrainersForAdmin,
  updateTrainerStatus,
} from "@/service/trainers";
import { ForbiddenError, UnauthorizedError } from "@/service/errors";
import type { SelectUser } from "@/types/users";
import type { PublicTrainerUser, TrainerStatus } from "@/types/trainers";

/**
 * Ensures the current request comes from an admin.
 * The role is re-read from the database instead of trusting the (possibly
 * stale) JWT, so a demoted admin loses access immediately.
 * @returns The authenticated admin user.
 * @throws UnauthorizedError - if there is no session
 * @throws ForbiddenError - if the user is not an admin
 */
export async function requireAdmin(): Promise<SelectUser> {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();

  const user = await getUserById(session.user.id);
  if (!user || user.role !== "admin") throw new ForbiddenError();

  return user;
}

export async function listTrainersForAdmin(
  status?: TrainerStatus,
): Promise<PublicTrainerUser[]> {
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
