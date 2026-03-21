import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, passwordResetTokens } from "../db/schema";

export async function createPasswordResetToken(userId: number, token: string, expires: Date) {
  await db
    .insert(passwordResetTokens)
    .values({
      user_id: userId,
      token: token,
      expires: expires,
    });
}

export async function deletePasswordResetTokenByUser(userId: number) {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.user_id, userId));
}

/**
 * Returns the user info and expiration of the provided password reset token.
 * Notice that it will successfully return null in case the token is invalid.
 * The behaviour in this case is to be handled by the caller.
 * @param token 
 * @returns Either the user info and expiration or null.
 */
export async function getUserByResetToken(token: string): Promise<{ id: number, email: string, expires: Date } | null> {
  const [tokenData] = await db
    .select({
      id: users.id,
      email: users.email,
      expires: passwordResetTokens.expires,
    })
    .from(passwordResetTokens)
    .innerJoin(users, eq(passwordResetTokens.user_id, users.id))
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  return tokenData || null;
}
