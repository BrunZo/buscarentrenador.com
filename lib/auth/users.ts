import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { generateVerificationToken } from "./verification_tokens";
import { db } from "../db/index";
import { users, type User } from "../db/schema";
import { Result } from "../model";

/**
 * Server actions:
 * 
 * verifyLogin(email, password)
 *  returns: user
 *  errors: invalid-credentials, email-not-verified, server-error
 * 
 * createUser(email, password, name, surname)
 *  returns: user_id, verification_token
 *  errors: server-error
 * 
 * updateUser(id, updates)
 *  returns: user_id
 *  errors: not-found, server-error
 * 
 * getUserById(id)
 *  returns: user
 *  errors: not-found, server-error
 * 
 * getUserByEmail(email)
 *  returns: user
 *  errors: not-found, server-error
 */

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyLogin(email: string, password: string): Promise<Result<Pick<User, 'id' | 'email' | 'name' | 'surname'>, 'invalid-credentials' | 'email-not-verified' | 'server-error'>> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password_hash: users.password_hash,
        name: users.name,
        surname: users.surname,
        email_verified: users.email_verified,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return { success: false, error: "invalid-credentials" };
    }

    const isPasswordValid = await compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { success: false, error: "invalid-credentials" };
    }

    if (!user.email_verified) {
      return { success: false, error: "email-not-verified" };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    };
  } catch (error) {
    console.error("Error verifying login:", error);
    return { success: false, error: "server-error" };
  }
}

export async function createUser(email: string, password: string, name: string, surname: string): Promise<Result<{ user_id: number; verification_token: string }, 'server-error'>> {
  try {
    const hashedPassword = await hashPassword(password);
    const result = await db
      .insert(users)
      .values({
        email,
        password_hash: hashedPassword,
        name,
        surname,
        email_verified: false,
      })
      .returning({ user_id: users.id });
    const { user_id } = result[0];
    
    const tokenResult = await generateVerificationToken(email);    
    if (!tokenResult.success || !tokenResult.data) {
      return { success: false, error: 'server-error' };
    }
    
    return { success: true, data: { user_id, verification_token: tokenResult.data.token } };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function updateUser(id: number, updates: Partial<Pick<User, 'name' | 'surname'>>): Promise<Result<{ user_id: number }, 'not-found' | 'server-error'>> {
  try {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({ user_id: users.id });
    
    if (result.length === 0) {
      return { success: false, error: 'not-found' };
    }
    
    const { user_id } = result[0];
    return { success: true, data: { user_id } };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getUserById(id: number): Promise<Result<Pick<User, 'id' | 'email' | 'name' | 'surname'>, 'not-found' | 'server-error'>> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (!user) {
      return { success: false, error: 'not-found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user by id:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getUserByEmail(email: string): Promise<Result<Pick<User, 'id' | 'email' | 'name' | 'surname' | 'email_verified'>, 'not-found' | 'server-error'>> {
  try {
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
      return { success: false, error: 'not-found' };
    }
    
    return { success: true, data: user };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return { success: false, error: 'server-error' };
  }
}

