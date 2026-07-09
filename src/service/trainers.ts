import { eq, and, or, desc, sql } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { db } from "@/db/index";
import { trainers, users } from "@/db/schema";
import type {
  UpdateTrainer,
  PublicTrainerUser,
  TrainerWithEmail,
} from "@/types/trainers";
import { TrainerNotFoundError } from "@/service/errors";
import { mailer } from "@/service/mailer";

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
    status: trainers.status,
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

export async function updateTrainer(
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
    .where(
      and(
        eq(trainers.id, id),
        eq(trainers.is_visible, true),
        eq(trainers.status, "approved"),
      ),
    )
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

type TrainerFilters = {
  query?: string;
  city?: string;
  province?: string;
  places: boolean[];
  groups: boolean[];
  levels: boolean[];
  include_email: boolean;
  require_visible: boolean;
  status: "approved" | "pending" | "rejected";
  limit: number;
  offset: number;
  salt: string;
};

type TrainerConditionFilters = Pick<
  TrainerFilters,
  | "query"
  | "city"
  | "province"
  | "places"
  | "groups"
  | "levels"
  | "require_visible"
  | "status"
>;

function buildTrainerConditions(filters: TrainerConditionFilters) {
  const conditions = [eq(trainers.status, filters.status)];

  if (filters.require_visible) conditions.push(eq(trainers.is_visible, true));

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

  return conditions;
}

export async function getTrainersCount(
  filters: TrainerConditionFilters,
): Promise<number> {
  const conditions = buildTrainerConditions(filters);

  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(...conditions));

  return Number(result?.count ?? 0);
}

export async function getTrainersByFilters(
  filters: TrainerFilters & { include_email: true },
): Promise<TrainerWithEmail[]>;
export async function getTrainersByFilters(
  filters: TrainerFilters & { include_email: false },
): Promise<PublicTrainerUser[]>;
export async function getTrainersByFilters(
  filters: TrainerFilters,
): Promise<PublicTrainerUser[] | TrainerWithEmail[]> {
  const conditions = buildTrainerConditions(filters);

  const selection = filters.include_email
    ? { ...publicTrainerSelect(), email: users.email }
    : publicTrainerSelect();

  let query = db
    .select(selection)
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(...conditions))
    .orderBy(
      sql`md5(${filters.salt || ""} || '-' || cast(${trainers.id} as text))`,
    )
    .$dynamic();

  if (filters.limit > 0) query = query.limit(filters.limit);
  if (filters.offset > 0) query = query.offset(filters.offset);

  return await query;
}

export async function createOrUpdateTrainer(
  userId: string,
  trainerData: UpdateTrainer,
): Promise<{ id: number }> {
  let trainerId: number;
  const existingTrainer = await getTrainerByUserId(userId);
  const created = !existingTrainer;
  if (existingTrainer) {
    trainerId = existingTrainer.id;
  } else {
    const newTrainer = await createTrainer(userId);
    if (!newTrainer) throw new TrainerNotFoundError();
    trainerId = newTrainer.id;
  }

  // A rejected trainer who edits and resubmits goes back into the queue, as if
  // they were recreating the profile. Approved/pending edits keep their status.
  const updates: UpdateTrainer = { ...trainerData };
  if (existingTrainer?.status === "rejected") updates.status = "pending";

  const updatedTrainer = await updateTrainer(trainerId, updates);
  if (!updatedTrainer) throw new TrainerNotFoundError();

  if (created) {
    try {
      await mailer.sendNewTrainer();
    } catch (error) {
      console.error("Failed to send new trainer notification:", error);
    }
  }

  return updatedTrainer;
}

export async function updateTrainerVisibility(
  userId: string,
  isVisible: boolean,
): Promise<{ id: number } | void> {
  const trainer = await getTrainerByUserId(userId);
  if (!trainer) throw new TrainerNotFoundError();

  const updatedTrainer = await updateTrainer(trainer.id, {
    is_visible: isVisible,
  });
  if (!updatedTrainer) throw new TrainerNotFoundError();
  return updatedTrainer;
}

