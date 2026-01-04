import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, type User } from "../db/schema";
import { UserNotFoundError, UserAlreadyExistsError } from "../errors";

/**
 * Server actions:
 * 
 * createUser(email, password, name, surname)
 *  returns: user
 * 
 * updateUser(id, updates)
 *  returns: user
 *  errors: UserNotFoundError
 * 
 * getUserById(id)
 *  returns: user
 *  errors: UserNotFoundError
 * 
 * getUserByEmail(email)
 *  returns: user
 *  errors: UserNotFoundError
 */

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function createUser(email: string, password: string, name: string, surname: string): Promise<User> {
  const hashedPassword = await hashPassword(password);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new UserAlreadyExistsError();
  }

  const [result] = await db
    .insert(users)
    .values({
      email,
      password_hash: hashedPassword,
      name,
      surname,
      email_verified: false,
    })
    .returning();

  return result;
}

export async function updateUser(id: number, updates: Partial<Pick<User, 'name' | 'surname'>>): Promise<User> {
  const [result] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();
  
  if (!result) {
    throw new UserNotFoundError();
  }

  return result;
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
  
  if (!user) {
    throw new UserNotFoundError();
  }
  
  return user;
}

export async function getUserByEmail(email: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname' | 'email_verified'>> {
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
  
  if (!user) {
    throw new UserNotFoundError();
  }
  
  return user;
}
