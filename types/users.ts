export type AuthProvider = "credentials" | "google";

export type UserSchema = {
  id: number;
  email: string;
  password_hash: string | null;
  name: string;
  surname: string;
  email_verified: boolean | null;
  auth_provider: AuthProvider;
  google_id: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

// sql helpers
export type NewUser = Pick<UserSchema, "email" | "name" | "surname"> & {
  password_hash: string;
};
export type NewGoogleUser = Pick<UserSchema, "email" | "name" | "surname"> & {
  google_id: string;
};
export type UpdateUser = Partial<
  Pick<UserSchema, "name" | "surname" | "password_hash" | "email_verified">
>;
export type SelectUser = Pick<
  UserSchema,
  | "id"
  | "email"
  | "password_hash"
  | "name"
  | "surname"
  | "email_verified"
  | "auth_provider"
  | "google_id"
>;

// only visible information
export type PublicUser = Pick<UserSchema, "email" | "name" | "surname">;
