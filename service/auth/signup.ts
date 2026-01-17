import { sendVerificationEmail } from "./email";
import { createUser } from "../data/users";
import { generateVerificationToken } from "./verification_tokens";

/**
 * Full signup flow:
 *  Creates user with provided email, password, name and surname
 *  Generates a random verification token.
 *  Sends it to the provided email address.
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
): Promise<{ user_id: number }> {
  const user = await createUser(email, password, name, surname);
  const token = await generateVerificationToken(email);
  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    token,
  });
  return { user_id: user.id };
}