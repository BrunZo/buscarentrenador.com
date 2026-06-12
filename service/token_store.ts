import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { users, verificationTokens, passwordResetTokens } from "@/db/schema";
import { generateRandomToken } from "@/service/crypto";

type TokenTable = typeof verificationTokens | typeof passwordResetTokens;

export type TokenLookup = {
  user_id: string;
  email: string;
  name: string;
  surname: string;
  emailVerified: Date | null;
  expires: Date;
};

export function tokenStore(table: TokenTable, ttlMs: number) {
  return {
    async issue(userId: string): Promise<string> {
      await db.delete(table).where(eq(table.user_id, userId));
      const token = generateRandomToken();
      const expires = new Date(Date.now() + ttlMs);
      await db.insert(table).values({ user_id: userId, token, expires });
      return token;
    },

    async lookup(token: string): Promise<TokenLookup | null> {
      const [row] = await db
        .select({
          user_id: table.user_id,
          email: users.email,
          name: users.name,
          surname: users.surname,
          emailVerified: users.emailVerified,
          expires: table.expires,
        })
        .from(table)
        .innerJoin(users, eq(table.user_id, users.id))
        .where(eq(table.token, token))
        .limit(1);
      return row ?? null;
    },

    async revoke(userId: string): Promise<void> {
      await db.delete(table).where(eq(table.user_id, userId));
    },
  };
}
