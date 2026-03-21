export type NewPasswordResetToken = {
  user_id: number;
  token: string;
  expires: Date;
};

export type PasswordResetTokenWithUser = {
  id: number;
  email: string;
  expires: Date;
};
