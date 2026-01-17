import type { UserInfo } from "@/types/users";
import { compare } from "bcrypt";
import { InvalidCredentialsError, EmailNotVerifiedError, UserNotFoundError } from "../errors";
import { getUserByEmail } from "@/data/users";

/**
 * Verifies an email and password pair.
 * If unsuccessful, the method will throw an error.
 * If successful, the method will return the user public info.
 * @param email
 * @param password
 * @returns The id, email, name and surname of the logged in user.
 * @throws UserNotFound - if there's no user with that email
 * @throws InvalidCredentialsError - if the password does not match
 * @throws EmailNotVerifiedError - if the user's email is not verified
 */
export async function verifyLogin(email: string, password: string): Promise<UserInfo & { id: number }> {
  const user = await getUserByEmail(email);
  if (!user)
    throw new UserNotFoundError();

  const isPasswordValid = await compare(password, user.password_hash);
  if (!isPasswordValid)
    throw new InvalidCredentialsError();
  
  if (!user.email_verified)
    throw new EmailNotVerifiedError();

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    surname: user.surname,
  };
}