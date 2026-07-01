import { and, eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users, accounts } from "@/db/schema";
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

export async function listAdmins(): Promise<
  Pick<SelectUser, "email" | "name">[]
> {
  return db
    .select({ email: users.email, name: users.name })
    .from(users)
    .where(eq(users.role, "admin"));
}

// Google-only users have no password account, so the change-password form is
// hidden for them.
export async function userHasPasswordAccount(userId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: accounts.id })
    .from(accounts)
    .where(
      and(eq(accounts.userId, userId), eq(accounts.providerId, "credential")),
    )
    .limit(1);

  return !!row;
}
