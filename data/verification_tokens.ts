import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users, verificationTokens } from "@/db/schema";
import type { NewVerificationToken, VerificationTokenWithUser } from "@/types/verification_tokens";

export async function createVerificationToken(newVerificationToken: NewVerificationToken): Promise<NewVerificationToken> {
  const [result] = await db
    .insert(verificationTokens)
    .values(newVerificationToken)
    .returning();

  return result;
}

export async function deleteVerificationTokenByUser(userId: number): Promise<void> {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.user_id, userId));
}

export async function getUserByToken(token: string): Promise<VerificationTokenWithUser | null> {
  const [result] = await db
    .select({
      user_id: verificationTokens.user_id,
      token: verificationTokens.token,
      expires: verificationTokens.expires,
      email: users.email,
      name: users.name,
      surname: users.surname,
      email_verified: users.email_verified,
    })
    .from(verificationTokens)
    .innerJoin(users, eq(verificationTokens.user_id, users.id))
    .where(eq(verificationTokens.token, token))
    .limit(1);

  return result ?? null;
}
