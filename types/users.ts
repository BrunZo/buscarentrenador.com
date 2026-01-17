export type UserSchema = {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  surname: string;
  email_verified: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
};

// sql helpers
export type NewUser = Pick<UserSchema, 'email' | 'password_hash' | 'name' | 'surname'>;
export type UpdateUser = Pick<UserSchema, 'name' | 'surname'>;
export type SelectUser = Pick<UserSchema, 'id' | 'email' | 'password_hash' | 'name' | 'surname' | 'email_verified'>;

// only visible information
export type UserInfo = Pick<UserSchema, 'email' | 'name' | 'surname'>;  