import { InvalidResetTokenError, ResetTokenExpiredError, UserNotFoundError } from "../errors";
import { getUserByEmail, updateUserPassword } from "../data/users";
import { createPasswordResetToken, deletePasswordResetTokenByUser, getUserByResetToken } from "../data/password_reset_tokens";
import { generateRandomToken, hashPassword } from "../crypto";

/**
 * Generates a password reset token for the user with the provided email.
 * - Finds a user with the provided email
 * - Generates a random reset token
 * - Adds it to the password_reset_tokens table for the found user
 * - Deletes all previous reset tokens for that user
 * @param email 
 * @returns The newly generated token
 * @throws UserNotFoundError - if there's no user with provided email
 */
export async function generatePasswordResetToken(email: string): Promise<string> {
  const user = await getUserByEmail(email);

  // Delete any existing reset tokens for this user
  await deletePasswordResetTokenByUser(user.id);

  // Generate new token with 1 hour expiration (shorter than email verification for security)
  const newToken = generateRandomToken();
  const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await createPasswordResetToken(user.id, newToken, tokenExpires);
  
  return newToken;
}

/**
 * Resets the password for the user corresponding to the provided token.
 * Deletes the token if reset is successful.
 * @param token - The password reset token
 * @param newPassword - The new password (plain text, will be hashed)
 * @throws InvalidResetTokenError - if there's no such token
 * @throws ResetTokenExpiredError - if the token has already expired
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  const tokenData = await getUserByResetToken(token);
  
  if (!tokenData)
    throw new InvalidResetTokenError();

  if (new Date() > new Date(tokenData.expires))
    throw new ResetTokenExpiredError();

  // Hash the new password and update the user
  const newPasswordHash = await hashPassword(newPassword);
  await updateUserPassword(tokenData.id, newPasswordHash);
  
  // Delete the used token
  await deletePasswordResetTokenByUser(tokenData.id);
}
