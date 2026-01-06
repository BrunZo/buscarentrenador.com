import { hash } from "bcrypt";
import crypto from "crypto";

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}
  