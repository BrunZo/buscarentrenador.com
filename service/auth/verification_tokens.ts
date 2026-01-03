import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, verificationTokens } from "../db/schema";
import { Result } from "../model";

/**
 * Server actions:
 * 
 * generateVerificationToken(email)
 *  returns: token
 *  errors: user-not-found, already-verified, server-error
 * 
 * verifyUserEmail(token)
 *  returns: success
 *  errors: invalid-token, already-verified, token-expired, server-error
 */

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function generateVerificationToken(email: string): Promise<Result<{ token: string }, 'user-not-found' | 'already-verified' | 'server-error'>> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email_verified: users.email_verified,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return { success: false, error: "user-not-found" };
    }

    if (user.email_verified) {
      return { success: false, error: "already-verified" };
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

    return { success: true, data: { token: newToken } };
  } catch (error) {
    console.error("Error generating verification token:", error);
    return { success: false, error: "server-error" };
  }
}

export async function verifyUserEmail(token: string): Promise<Result<null, 'invalid-token' | 'already-verified' | 'token-expired' | 'server-error'>> {
  try {
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
      return { success: false, error: "invalid-token" };
    }

    if (tokenData.email_verified) {
      return { success: false, error: "already-verified" };
    }

    if (new Date() > new Date(tokenData.expires)) {
      return { success: false, error: "token-expired" };
    }

    await db
      .update(users)
      .set({ email_verified: true })
      .where(eq(users.id, tokenData.id));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return { success: true, data: null };
  } catch (error) {
    console.error("Error verifying user email:", error);
    return { success: false, error: "server-error" };
  }
}
