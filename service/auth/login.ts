import type { SelectUser } from "@/types/users";
import { compare } from "bcrypt";
import {
  InvalidCredentialsError,
  EmailNotVerifiedError,
  UserNotFoundError,
  EmailRegisteredWithGoogleError,
} from "@/service/errors";
import { getUserByEmail } from "@/service/users";

/**
 * Verifies an email and password pair.
 * If unsuccessful, the method will throw an error.
 * If successful, the method will return the user public info.
 * @param email
 * @param password
 * @returns The id, email, name and surname of the logged in user.
 * @throws UserNotFound - if there's no user with that email
 * @throws EmailRegisteredWithGoogleError - if the user signed up with Google
 * @throws EmailNotVerifiedError - if the user's email is not verified
 * @throws InvalidCredentialsError - if the password does not match
 */
export async function verifyLogin(
  email: string,
  password: string,
): Promise<SelectUser> {
  const user = await getUserByEmail(email);
  if (!user) throw new UserNotFoundError();

  if (!user.password_hash) throw new EmailRegisteredWithGoogleError();

  if (!user.emailVerified) throw new EmailNotVerifiedError();

  const isPasswordValid = await compare(password, user.password_hash);
  if (!isPasswordValid) throw new InvalidCredentialsError();

  return user;
}
