import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, verificationTokens } from "../db/schema";
import { UserNotFoundError, AlreadyVerifiedError, InvalidTokenError, TokenExpiredError } from "../errors";

/**
 * Server actions:
 * 
 * generateVerificationToken(email)
 *  returns: token
 *  errors: UserNotFoundError, AlreadyVerifiedError
 * 
 * verifyUserEmail(token)
 *  returns: void
 *  errors: InvalidTokenError, AlreadyVerifiedError, TokenExpiredError
 */

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function generateVerificationToken(email: string): Promise<string> {
  const [user] = await db
    .select({
      id: users.id,
      email_verified: users.email_verified,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.email_verified) {
    throw new AlreadyVerifiedError();
  }

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.user_id, user.id));

  const newToken = generateRandomToken();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(verificationTokens).values({
    user_id: user.id,
    token: newToken,
    expires: tokenExpires,
  });

  return newToken;
}

export async function verifyUserEmail(token: string): Promise<void> {
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

  if (!tokenData) {
    throw new InvalidTokenError();
  }

  if (tokenData.email_verified) {
    throw new AlreadyVerifiedError();
  }

  if (new Date() > new Date(tokenData.expires)) {
    throw new TokenExpiredError();
  }

  await db
    .update(users)
    .set({ email_verified: true })
    .where(eq(users.id, tokenData.id));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));
}
