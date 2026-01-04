import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, type User } from "../db/schema";
import { hashPassword } from "../crypto"
import { UserNotFoundError, EmailAlreadyInUseError } from "../errors";

/**
 * @param email
 * @param password
 * @param name
 * @param surname
 * @returns The new User object.
 * @throws EmailAlreadyInUseError - if the email is already in use
 */
export async function createUser(email: string, password: string, name: string, surname: string): Promise<User> {
  const emailInUse = await isEmailInUse(email).catch(() => null);
  if (emailInUse) {
    throw new EmailAlreadyInUseError();
  }

  const password_hash = await hashPassword(password);

  const [result] = await db
    .insert(users)
    .values({
      email,          // only UNIQUE field in this table
      password_hash,
      name,
      surname,
      email_verified: false,
    })
    .returning();

  return result;
}

/**
 * @throws UserNotFoundError - if there's no user with such id.
 */
export async function updateUser(id: number, updates: Partial<Pick<User, 'name' | 'surname'>>): Promise<User> {
  const [user] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();
  
  if (!user)
    throw new UserNotFoundError();

  return user;
}

export async function getUserById(id: number): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname'>> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      surname: users.surname
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  
  if (!user)
    throw new UserNotFoundError();
  
  return user;
}

/**
 * Checks whether an email is already in use in the database.
 * Returns true <=> there is a user with that email.
 */
export async function isEmailInUse(email: string): Promise<boolean> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      surname: users.surname,
      email_verified: users.email_verified,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user)
    return false;
  return true;
}

/**
 * Fetches the user with a given email.
 * CAUTION: It will throw an exception if the user does not exist.
 */
export async function getUserByEmail(email: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname' | 'email_verified' | 'password_hash'>> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      surname: users.surname,
      email_verified: users.email_verified,
      password_hash: users.password_hash
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  
  if (!user)
    throw new UserNotFoundError();
  
  return user;
}

export async function setEmailVerifiedByUser(userId: number) {
  const [result] = await db
    .update(users)
    .set({ email_verified: true })
    .where(eq(users.id, userId))
    .returning();
  
  if (!result)
    throw new UserNotFoundError();
}