import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users, verificationTokens } from "../db/schema";

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function generateVerificationToken(email: string): Promise<{ success: boolean; token?: string; error?: string }> {
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
      return { success: false, error: "Usuario no encontrado" };
    }

    if (user.email_verified) {
      return { success: false, error: "El correo ya está verificado" };
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

    return { success: true, token: newToken };
  } catch (error) {
    console.error("Error generating verification token:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function verifyUserEmail(token: string): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: "Token inválido" };
    }

    if (tokenData.email_verified) {
      return { success: false, error: "El correo ya está verificado" };
    }

    if (new Date() > new Date(tokenData.expires)) {
      return { success: false, error: "El token ha expirado" };
    }

    await db
      .update(users)
      .set({ email_verified: true })
      .where(eq(users.id, tokenData.id));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return { success: true };
  } catch (error) {
    console.error("Error verifying user email:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
