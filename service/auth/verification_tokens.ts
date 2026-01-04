import { AlreadyVerifiedError, TokenExpiredError, InvalidTokenError } from "../errors";
import { getUserByEmail, setEmailVerifiedByUser } from "../data/users";
import { createVerificationToken, deleteVerificationTokenByUser, getUserByToken } from "../data/verification_tokens";
import { generateRandomToken } from "../crypto";

/**
 * 
 * - Finds a user with the provided email
 * - Generates a random verification token
 * - Adds it to the verification tokens table for the found user
 * - Deletes all previous verification token for that user.
 * @param email 
 * @returns The newly generated token
 * @throws UserNotFound - if there's no user with provided email
 * @throws AlreadyVerifiedError - if the user's email is already verified.
 */
export async function generateVerificationToken(email: string): Promise<string> {
  const user = await getUserByEmail(email);
  if (user.email_verified)
    throw new AlreadyVerifiedError();

  await deleteVerificationTokenByUser(user.id);

  const newToken = generateRandomToken();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createVerificationToken(user.id, newToken, tokenExpires)
  return newToken;
}

/**
 * Verifies the user corresponding to the provided token. Deletes it if verification is successful.
 * @param email 
 * @throws InvalidTokenError - if there's no such token
 * @throws AlreadyVerifiedError - if the user's email is already verified.
 * @throws TokenExpiredError - if the token has already expired.
 */
export async function verifyUserEmail(token: string) {
  const tokenData = await getUserByToken(token);
  if (!tokenData)
    throw new InvalidTokenError();
  
  if (tokenData.email_verified)
    throw new AlreadyVerifiedError();

  if (new Date() > new Date(tokenData.expires))
    throw new TokenExpiredError();

  await setEmailVerifiedByUser(tokenData.id);
  await deleteVerificationTokenByUser(tokenData.id);
}
