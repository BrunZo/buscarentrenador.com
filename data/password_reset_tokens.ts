import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users, passwordResetTokens } from "@/db/schema";
import type { NewPasswordResetToken, PasswordResetTokenWithUser } from "@/types/password_reset_tokens";

export async function createPasswordResetToken(newToken: NewPasswordResetToken): Promise<void> {
  await db.insert(passwordResetTokens).values(newToken);
}

export async function deletePasswordResetTokenByUser(userId: number): Promise<void> {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.user_id, userId));
}

export async function getUserByResetToken(token: string): Promise<PasswordResetTokenWithUser | null> {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
      expires: passwordResetTokens.expires,
    })
    .from(passwordResetTokens)
    .innerJoin(users, eq(passwordResetTokens.user_id, users.id))
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  return result ?? null;
}
