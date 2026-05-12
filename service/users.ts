import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import type {
  NewUser,
  NewGoogleUser,
  UpdateUser,
  SelectUser,
} from "@/types/users";
import { UserNotFoundError } from "@/service/errors";

async function isEmailInUse(email: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return !!user;
}

export async function createUser(newUser: NewUser): Promise<SelectUser | null> {
  if (await isEmailInUse(newUser.email)) {
    return null;
  }

  const [result] = await db
    .insert(users)
    .values({ ...newUser, auth_provider: "credentials" })
    .returning();
  return result;
}

export async function createGoogleUser(
  newUser: NewGoogleUser,
): Promise<SelectUser | null> {
  if (await getUserByGoogleId(newUser.google_id)) {
    return null;
  }

  if (await isEmailInUse(newUser.email)) {
    return null;
  }

  const [result] = await db
    .insert(users)
    .values({
      ...newUser,
      auth_provider: "google",
      email_verified: true,
    })
    .returning();
  return result;
}

export async function updateUser(
  id: number,
  updates: UpdateUser,
): Promise<SelectUser | null> {
  const [result] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  return result ?? null;
}

export async function getUserByEmail(
  email: string,
): Promise<SelectUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function getUserByGoogleId(
  googleId: string,
): Promise<SelectUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.google_id, googleId))
    .limit(1);

  return user ?? null;
}

export async function updateUserProfile(
  userId: number,
  updates: UpdateUser,
): Promise<SelectUser> {
  const user = await updateUser(userId, updates);
  if (!user) throw new UserNotFoundError();

  return user;
}
