import { sendVerificationEmail } from "@/service/auth/email";
import { createUser, getUserByEmail } from "@/data/users";
import { generateVerificationToken } from "@/service/auth/verification_tokens";
import { hashPassword } from "@/service/crypto";
import { UserInfo } from "@/types/users";
import {
  EmailAlreadyInUseError,
  EmailRegisteredWithGoogleError,
} from "@/service/errors";

/**
 * Full signup flow:
 *  Creates user with provided email, password, name and surname
 *  Generates a random verification token.
 *  Sends it to the provided email address.
 *
 * @param email
 * @param password
 * @param name
 * @param surname
 * @returns The registered user's id.
 * @throws EmailAlreadyInUseError - if the email is registered with credentials
 * @throws EmailRegisteredWithGoogleError - if the email is registered with Google
 *
 * Dev notes:
 * - generateVerificationToken could throw UserNotFound or AlreadyVerifiedError, but this is not expected unless createUser is not working properly.
 * - sendVerificationEmail could throw a ServerError if something is wrong with the email sender.
 */
export async function signupUser(
    email: string,
    password: string,
    name: string,
    surname: string
): Promise<UserInfo> {
  const existing = await getUserByEmail(email);
  if (existing) {
    if (existing.auth_provider === 'google') {
      throw new EmailRegisteredWithGoogleError();
    }
    throw new EmailAlreadyInUseError();
  }

  const password_hash = await hashPassword(password);

  const user = await createUser({ email, password_hash, name, surname });
  if (!user)
    throw new EmailAlreadyInUseError();

  const token = await generateVerificationToken(email);
  await sendVerificationEmail(user.email, user.name, token);

  return user;
}
