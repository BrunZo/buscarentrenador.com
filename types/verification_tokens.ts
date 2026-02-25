import { UserSchema } from "./users";

export type VerificationTokenSchema = {
  user_id: number;
  token: string;
  expires: Date;
};

// sql helpers
export type NewVerificationToken = Pick<VerificationTokenSchema, 'user_id' | 'token' | 'expires'>;

// verification token with user info (from join)
export type VerificationTokenWithUser = VerificationTokenSchema & Pick<UserSchema, 'email' | 'name' | 'surname' | 'email_verified'>;