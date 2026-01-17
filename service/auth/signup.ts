import { sendVerificationEmail } from "./email";
import { createUser } from "@/data/users";
import { generateVerificationToken } from "./verification_tokens";
import { hashPassword } from "../crypto";
import { NewUser, UserInfo } from "@/types/users";
import { EmailAlreadyInUseError } from "../errors";

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
 * @throws EmailAlreadyInUseError
 * 
 * Dev notes: 
 * - the method generateVerificationToken could throw UserNotFound or AlreadyVerifiedError, but this is not to be expected except the createUser method is not working properly.
 * - the sendVerifcationEmail method could throw a ServerError if something is wrong with the email sender. 
 */
export async function signupUser(
    email: string, 
    password: string, 
    name: string, 
    surname: string
): Promise<UserInfo> {
  const password_hash = await hashPassword(password);

  const user = await createUser({ email, password_hash, name, surname });
  if (!user)
    throw new EmailAlreadyInUseError();

  const token = await generateVerificationToken(email);
  await sendVerificationEmail(user.email, user.name, token);

  return user;
}