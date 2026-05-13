import { AlreadyVerifiedError, TokenExpiredError, InvalidTokenError, UserNotFoundError } from "@/service/errors";
import { getUserByEmail, updateUser } from "@/service/users";
import { createVerificationToken, deleteVerificationTokenByUser, getUserByToken } from "@/data/verification_tokens";
import { generateRandomToken } from "@/service/crypto";
import { sendVerificationEmail } from "@/service/auth/email";

/**
 * - Finds a user with the provided email
 * - Generates a random verification token
 * - Adds it to the verification tokens table for the found user
 * - Deletes all previous verification token for that user.
 * @param email
 * @returns The newly generated token
 * @throws UserNotFoundError - if there's no user with provided email
 * @throws AlreadyVerifiedError - if the user's email is already verified.
 */
export async function generateVerificationToken(email: string): Promise<string> {
  const user = await getUserByEmail(email);
  if (!user)
    throw new UserNotFoundError();

  if (user.email_verified)
    throw new AlreadyVerifiedError();

  await deleteVerificationTokenByUser(user.id);

  const newToken = generateRandomToken();
  const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await createVerificationToken({ user_id: user.id, token: newToken, expires: tokenExpires });
  return newToken;
}

/**
 * Verifies the user corresponding to the provided token. Deletes it if verification is successful.
 * @param token
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

  // Delete the token before marking verified so a failed update cannot be retried.
  await deleteVerificationTokenByUser(tokenData.user_id);
  await updateUser(tokenData.user_id, { email_verified: true });
}

/**
 * Resends a verification email to the user with the provided email address.
 * - Generates a new verification token
 * - Sends the verification email
 * @param email - The email address of the user
 * @throws UserNotFoundError - if there's no user with provided email
 * @throws AlreadyVerifiedError - if the user's email is already verified
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  // generateVerificationToken throws UserNotFoundError if no user exists, so user is guaranteed here
  const token = await generateVerificationToken(email);
  const user = await getUserByEmail(email);
  await sendVerificationEmail(user!.email, user!.name, token);
}
