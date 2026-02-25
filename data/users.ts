import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users } from "../db/schema";
import { NewUser, UpdateUser, SelectUser } from "@/types/users";

/**
 * @param email
 * @param password
 * @param name
 * @param surname
 * @returns The new User object or null if the email is already in use.
 */
export async function createUser(newUser: NewUser): Promise<SelectUser | null> {
  const emailInUse = await isEmailInUse(newUser.email)
  if (emailInUse) {
    return null;
  }

  const [result] = await db
    .insert(users)
    .values(newUser)
    .returning();

  return result;
}

/**
 * @param id
 * @param updates
 * @returns The updated User object or null if the user does not exist.
 */
export async function updateUser(id: number, updates: UpdateUser): Promise<SelectUser | null> {
  const [user] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();
  
  return user;
}

/**
 * Checks whether an email is already in use in the database.
 * Returns true <=> there is a user with that email.
 */
export async function isEmailInUse(email: string): Promise<boolean> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return !!user;
}

/**
 * Fetches the user with a given email.
 */
export async function getUserByEmail(email: string): Promise<SelectUser | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  return user;
}

export async function setEmailVerifiedByUser(userId: number) {
  const [result] = await db
    .update(users)
    .set({ email_verified: true })
    .where(eq(users.id, userId))
    .returning();

  return result;
}