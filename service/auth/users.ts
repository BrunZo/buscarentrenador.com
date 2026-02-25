import { updateUser } from "@/data/users";
import type { UpdateUser, UserInfo } from "@/types/users";
import { UserNotFoundError } from "../errors";

/**
 * Updates a user's profile information (name and surname).
 * @param userId - The ID of the user to update
 * @param updates - Object containing name and surname to update
 * @returns The updated UserInfo object
 * @throws UserNotFoundError - if there's no user with such id
 */
export async function updateUserProfile(userId: number, updates: UpdateUser): Promise<UserInfo> {
  const user = await updateUser(userId, updates);
  if (!user)
    throw new UserNotFoundError();

  return user;
}

