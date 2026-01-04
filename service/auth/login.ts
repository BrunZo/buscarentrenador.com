import { type User, users } from "../db/schema";
import { db } from "../db/index";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
import { UserNotFoundError, InvalidCredentialsError, EmailNotVerifiedError } from "../errors";

/**
 * Server actions:
 * 
 * verifyLogin(email, password)
 *  returns: user
 *  errors: UserNotFoundError, InvalidCredentialsError, EmailNotVerifiedError
 */

export async function verifyLogin(email: string, password: string): Promise<Pick<User, 'id' | 'email' | 'name' | 'surname'>> {
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
    throw new UserNotFoundError();
  }

  const isPasswordValid = await compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  if (!user.email_verified) {
    throw new EmailNotVerifiedError();
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
}