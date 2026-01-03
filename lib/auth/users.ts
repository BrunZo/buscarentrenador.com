import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { generateVerificationToken } from "./verification_tokens";
import { db } from "../db/index";
import { users, type User } from "../db/schema";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyLogin(email: string, password: string): Promise<{ success: boolean; user?: Pick<User, 'id' | 'email' | 'name' | 'surname'>; error?: 'invalid-credentials' | 'email-not-verified' | 'server-error' }> {
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
      user: {
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

export async function createUser(email: string, password: string, name: string, surname: string) {
  try {
    const hashedPassword = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        email,
        password_hash: hashedPassword,
        name,
        surname,
        email_verified: false,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        surname: users.surname,
      });
    
    const { success, token, error } = await generateVerificationToken(email);
    
    if (!success) {
      throw new Error(error);
    }
    return { ...user, verification_token: token! };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function updateUser(id: number, updates: Partial<Pick<User, 'name' | 'surname'>>): Promise<User | null> {
  try {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || null;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function getUserById(id: number): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname'> | null> {
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
    
    return user || null;
  } catch (error) {
    console.error("Error getting user by id:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname' | 'email_verified'> | null> {
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
      return null;
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      email_verified: user.email_verified,
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

