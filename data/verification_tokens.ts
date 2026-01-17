import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, verificationTokens } from "../db/schema";
import type { NewVerificationToken, VerificationTokenWithUser } from "../types/verification_tokens";

function getVerificationTokenWithUserSelect() {
  return {
    user_id: verificationTokens.user_id,
    token: verificationTokens.token,
    expires: verificationTokens.expires,
    email: users.email,
    password_hash: users.password_hash,
    name: users.name,
    surname: users.surname,
    email_verified: users.email_verified,
    created_at: users.created_at,
    updated_at: users.updated_at,
    id: users.id,
  };
}

export async function createVerificationToken(newVerificationToken: NewVerificationToken) {
  const [result] = await db
    .insert(verificationTokens)
    .values(newVerificationToken)
    .returning();

  return result;
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
export async function getUserByToken(token: string): Promise<VerificationTokenWithUser | null> {
  const [result] = await db
    .select(getVerificationTokenWithUserSelect())
    .from(verificationTokens)
    .innerJoin(users, eq(verificationTokens.user_id, users.id))
    .where(eq(verificationTokens.token, token))
    .limit(1);

  if (!result)
    return null;

  return result;
}
