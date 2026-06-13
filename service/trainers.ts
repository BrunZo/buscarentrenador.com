import { eq, and, or, desc, sql } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { db } from "@/db/index";
import { trainers, users } from "@/db/schema";
import type { UpdateTrainer, PublicTrainerUser } from "@/types/trainers";
import { TrainerNotFoundError } from "@/service/errors";

function publicTrainerSelect() {
  return {
    id: trainers.id,
    name: users.name,
    surname: users.surname,
    city: trainers.city,
    province: trainers.province,
    description: trainers.description,
    hourly_rate: trainers.hourly_rate,
    levels: trainers.levels,
    places: trainers.places,
    groups: trainers.groups,
    certifications: trainers.certifications,
    is_visible: trainers.is_visible,
    soy_exo: trainers.soy_exo,
    examenes_oma: trainers.examenes_oma,
  };
}

// Postgres arrays are 1-indexed; returns an OR fragment for each true position, or null if all false.
function boolArrayFilter(col: AnyColumn, values: boolean[]) {
  const conditions = values
    .map((value, index) => (value ? sql`${col}[${index + 1}] = true` : null))
    .filter((c): c is ReturnType<typeof sql> => c !== null);
  return conditions.length ? or(...conditions)! : null;
}

async function createTrainer(userId: string): Promise<{ id: number } | null> {
  const [result] = await db
    .insert(trainers)
    .values({ user_id: userId })
    .returning();

  return result ?? null;
}

async function updateTrainer(
  trainerId: number,
  updates: UpdateTrainer,
): Promise<{ id: number } | null> {
  const [result] = await db
    .update(trainers)
    .set(updates)
    .where(eq(trainers.id, trainerId))
    .returning();

  return result ?? null;
}

export async function getTrainerById(
  id: number,
): Promise<PublicTrainerUser | null> {
  const [result] = await db
    .select(publicTrainerSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(eq(trainers.id, id), eq(trainers.is_visible, true)))
    .limit(1);

  return result ?? null;
}

export async function getTrainerByUserId(
  userId: string,
): Promise<PublicTrainerUser | null> {
  const [result] = await db
    .select(publicTrainerSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);

  return result ?? null;
}

export async function getTrainerEmail(
  trainerId: number,
): Promise<string | null> {
  const [result] = await db
    .select({ email: users.email })
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.id, trainerId))
    .limit(1);

  return result?.email ?? null;
}

export async function getTrainersByFilters(filters: {
  query?: string;
  city?: string;
  province?: string;
  places: boolean[];
  groups: boolean[];
  levels: boolean[];
}): Promise<PublicTrainerUser[]> {
  const conditions = [eq(trainers.is_visible, true)];

  if (filters.query) {
    conditions.push(
      sql`(${users.name} || ' ' || ${users.surname}) ILIKE ${`%${filters.query}%`}`,
    );
  }

  if (filters.city) conditions.push(eq(trainers.city, filters.city));
  if (filters.province)
    conditions.push(eq(trainers.province, filters.province));

  const placesFilter = boolArrayFilter(trainers.places, filters.places);
  if (placesFilter) conditions.push(placesFilter);

  const groupsFilter = boolArrayFilter(trainers.groups, filters.groups);
  if (groupsFilter) conditions.push(groupsFilter);

  const levelsFilter = boolArrayFilter(trainers.levels, filters.levels);
  if (levelsFilter) conditions.push(levelsFilter);

  return db
    .select(publicTrainerSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(...conditions))
    .orderBy(desc(trainers.created_at));
}

export async function createOrUpdateTrainer(
  userId: string,
  trainerData: UpdateTrainer,
): Promise<{ id: number }> {
  let trainerId: number;
  const existingTrainer = await getTrainerByUserId(userId);
  if (existingTrainer) {
    trainerId = existingTrainer.id;
  } else {
    const created = await createTrainer(userId);
    if (!created) throw new TrainerNotFoundError();
    trainerId = created.id;
  }

  const updatedTrainer = await updateTrainer(trainerId, trainerData);
  if (!updatedTrainer) throw new TrainerNotFoundError();
  return updatedTrainer;
}

export async function updateTrainerVisibility(
  userId: string,
  isVisible: boolean,
): Promise<{ id: number } | void> {
  const trainer = await getTrainerByUserId(userId);
  if (!trainer) throw new TrainerNotFoundError();

  const updatedTrainer = await updateTrainer(trainer.id, {
    is_visible: isVisible ? true : null,
  });
  if (!updatedTrainer) throw new TrainerNotFoundError();
  return updatedTrainer;
}
