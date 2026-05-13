import { sendVerificationEmail } from "@/service/auth/email";
import {
  createUser,
  getUserByEmail,
  createGoogleUser,
  getUserByGoogleId,
} from "@/service/users";
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
    if (existing.auth_provider === "google") {
      throw new EmailRegisteredWithGoogleError();
    }
    throw new EmailAlreadyInUseError();
  }

  const password_hash = await hashPassword(password);

  const user = await createUser({ email, password_hash, name, surname });
  if (!user) throw new EmailAlreadyInUseError();

  const token = await generateVerificationToken(email);
  await sendVerificationEmail(user.email, user.name, token);

  return user;
}

type GoogleProfile = {
  name?: string | null;
  given_name?: string;
  family_name?: string;
};

export function splitGoogleName(profile: GoogleProfile): {
  name: string;
  surname: string;
} {
  const given = profile.given_name?.trim();
  const family = profile.family_name?.trim();
  if (given && family) return { name: given, surname: family };

  const fullName = profile.name?.trim() ?? "";
  const parts = fullName.split(/\s+/).filter(Boolean);

  return {
    name: given || parts[0] || "Usuario",
    surname: family || parts.slice(1).join(" ") || "-",
  };
}

export async function handleGoogleSignIn(
  googleId: string,
  email: string,
  profile: GoogleProfile,
): Promise<SelectUser | string> {
  const existingByGoogleId = await getUserByGoogleId(googleId);
  if (existingByGoogleId) return existingByGoogleId;

  const { name, surname } = splitGoogleName(profile);

  const existingByEmail = await getUserByEmail(email);
  if (existingByEmail) {
    if (existingByEmail.auth_provider !== "google") {
      return "/login?error=email_in_use_credentials";
    }
    return existingByEmail;
  }

  const created = await createGoogleUser({
    email,
    name,
    surname,
    google_id: googleId,
  });
  if (!created) return "/login?error=google_signup_failed";

  return created;
}
