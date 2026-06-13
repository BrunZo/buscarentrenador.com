export type UserSchema = {
  id: string;
  email: string;
  name: string;
  surname: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateUser = Partial<Pick<UserSchema, "name" | "surname">>;
export type SelectUser = Pick<
  UserSchema,
  "id" | "email" | "name" | "surname" | "emailVerified"
>;

export type PublicUser = Pick<UserSchema, "email" | "name" | "surname">;

// Shape of the authenticated user as exposed to UI components.
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  surname: string;
  image?: string | null;
};
