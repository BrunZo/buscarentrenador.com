import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import type { UpdateUser, SelectUser } from "@/types/users";
import { UserNotFoundError } from "@/service/errors";

export async function updateUser(
  id: string,
  updates: UpdateUser,
): Promise<SelectUser | null> {
  const [result] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  return result ?? null;
}

export async function updateUserProfile(
  userId: string,
  updates: UpdateUser,
): Promise<SelectUser> {
  const user = await updateUser(userId, updates);
  if (!user) throw new UserNotFoundError();

  return user;
}
