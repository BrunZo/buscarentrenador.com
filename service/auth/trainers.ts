import { getTrainerByUserId, updateTrainer } from "@/data/trainers";
import { TrainerNotFoundError } from "../errors";
import type { TrainerInfo, UpdateTrainer } from "@/types/trainers";

/**
 * Creates a new trainer or updates an existing one for the given user.
 * If a trainer already exists for the user, it will be updated.
 * Otherwise, a new trainer will be created.
 * @param userId - The ID of the user
 * @param trainerData - The trainer data to create or update (uses TrainerUpdate type)
 * @returns Object indicating whether the trainer was created or updated, and the trainer ID
 * @throws TrainerNotFoundError - if trainer doesn't exist and creation fails (shouldn't happen)
 */
export async function createOrUpdateTrainer(
  userId: number,
  trainerData: UpdateTrainer
): Promise<TrainerInfo> {
  const existingTrainer = await getTrainerByUserId(userId);
  if (!existingTrainer)
    throw new TrainerNotFoundError();

  const updatedTrainer = await updateTrainer(existingTrainer.id, trainerData);
  if (!updatedTrainer)
    throw new TrainerNotFoundError();

  return updatedTrainer;
}

/**
 * Updates the visibility of a trainer profile.
 * @param userId - The ID of the user who owns the trainer profile
 * @param isVisible - Whether the trainer profile should be visible
 * @returns The trainer ID that was updated
 * @throws TrainerNotFoundError - if no trainer exists for the given user
 */
export async function updateTrainerVisibility(
  userId: number,
  isVisible: boolean
): Promise<TrainerInfo> {
  const trainer = await getTrainerByUserId(userId);
  if (!trainer)
    throw new TrainerNotFoundError();

  const updatedTrainer = await updateTrainer(trainer.id, { is_visible: isVisible ? true : null });
  if (!updatedTrainer)
    throw new TrainerNotFoundError();

  return updatedTrainer;
}

