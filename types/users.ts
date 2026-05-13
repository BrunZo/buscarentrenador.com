export type UserSchema = {
  id: string;
  email: string;
  password_hash: string | null;
  name: string;
  surname: string;
  emailVerified: Date | null;
  image: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type NewUser = Pick<UserSchema, "email" | "name" | "surname"> & {
  password_hash: string;
};
export type UpdateUser = Partial<
  Pick<UserSchema, "name" | "surname" | "password_hash" | "emailVerified">
>;
export type SelectUser = Pick<
  UserSchema,
  "id" | "email" | "password_hash" | "name" | "surname" | "emailVerified"
>;

export type PublicUser = Pick<UserSchema, "email" | "name" | "surname">;
