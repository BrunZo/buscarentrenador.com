import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, verificationTokens } from "../db/schema";

export async function createVerificationToken(userId: number, token: string, expires: Date) {
  await db
    .insert(verificationTokens)
    .values({
      user_id: userId,
      token: token,
      expires: expires,
    });
}

export async function deleteVerificationTokenByUser(userId: number) {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.user_id, userId));
}

/**
 * Returns the user info and expiration of the provided token.
 * Notice that it will successfully return null in case the token is invalid.
 * The behaviour in this case is to be handled by the caller.
 * @param token 
 * @returns Either the user info and expiration or null.
 */
export async function getUserByToken(token: string): Promise<{ id: number, email: string, email_verified: boolean | null, expires: Date } | null> {
  const [tokenData] = await db
    .select({
      id: users.id,
      email: users.email,
      email_verified: users.email_verified,
      expires: verificationTokens.expires,
    })
    .from(verificationTokens)
    .innerJoin(users, eq(verificationTokens.user_id, users.id))
    .where(eq(verificationTokens.token, token))
    .limit(1);

  return tokenData;
}