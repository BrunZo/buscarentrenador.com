import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import type { NewUser, UpdateUser, SelectUser } from "@/types/users";

export async function createUser(newUser: NewUser): Promise<SelectUser | null> {
  if (await isEmailInUse(newUser.email)) {
    return null;
  }

  const [result] = await db.insert(users).values(newUser).returning();
  return result;
}

export async function updateUser(id: number, updates: UpdateUser): Promise<SelectUser | null> {
  const [result] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  return result ?? null;
}

export async function isEmailInUse(email: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return !!user;
}

export async function getUserByEmail(email: string): Promise<SelectUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}
