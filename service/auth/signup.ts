import { sendVerificationEmail } from "./email";
import { createUser } from "./users";
import { generateVerificationToken } from "./verification_tokens";

/**
 * Server actions:
 * 
 * signupUser(email, password, name, surname)
 *  returns: user_id
 *  errors: ServerError
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