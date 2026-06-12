import { mailer } from "@/service/mailer";
import { createUser, getUserByEmail } from "@/service/users";
import { generateVerificationToken } from "@/service/auth/verification_tokens";
import { hashPassword } from "@/service/crypto";
import type { SelectUser } from "@/types/users";
import {
  EmailAlreadyInUseError,
  EmailRegisteredWithGoogleError,
} from "@/service/errors";

export async function signupUser(
  email: string,
  password: string,
  name: string,
  surname: string,
): Promise<SelectUser> {
  const existing = await getUserByEmail(email);
  if (existing) {
    if (!existing.password_hash) {
      throw new EmailRegisteredWithGoogleError();
    }
    throw new EmailAlreadyInUseError();
  }

  const password_hash = await hashPassword(password);

  const user = await createUser({ email, password_hash, name, surname });
  if (!user) throw new EmailAlreadyInUseError();

  const token = await generateVerificationToken(email);
  await mailer.sendVerification(user.email, user.name, token);

  return user;
}
