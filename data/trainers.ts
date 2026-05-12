import { eq, and, or, desc, sql } from 'drizzle-orm';
import { db } from '@/db/index';
import { trainers, users } from '@/db/schema';
import type { UpdateTrainer, SelectTrainerWithUser, SelectTrainer } from '@/types/trainers';
import type { AnyColumn } from 'drizzle-orm';

function getTrainerWithUserSelect() {
  return {
    id: trainers.id,
    user_id: trainers.user_id,
    name: users.name,
    email: users.email,
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
    created_at: trainers.created_at,
    updated_at: trainers.updated_at,
    password_hash: users.password_hash,
    email_verified: users.email_verified,
  };
}

// Postgres arrays are 1-indexed; returns an OR fragment for each true position, or null if all false.
function boolArrayFilter(col: AnyColumn, values: boolean[]) {
  const conditions = values
    .map((value, index) => value ? sql`${col}[${index + 1}] = true` : null)
    .filter((c): c is ReturnType<typeof sql> => c !== null);
  return conditions.length ? or(...conditions)! : null;
}

export async function createTrainer(userId: number): Promise<SelectTrainer | null> {
  const [result] = await db
    .insert(trainers)
    .values({ user_id: userId })
    .returning();

  return result ?? null;
}

export async function updateTrainer(trainerId: number, updates: UpdateTrainer): Promise<SelectTrainer | null> {
  const [result] = await db
    .update(trainers)
    .set(updates)
    .where(eq(trainers.id, trainerId))
    .returning();

  return result ?? null;
}

export async function getTrainerById(id: number): Promise<SelectTrainerWithUser | null> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.id, id))
    .limit(1);

  return result ?? null;
}

export async function getTrainerByUserId(userId: number): Promise<SelectTrainerWithUser | null> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);

  return result ?? null;
}

export async function getTrainersByFilters(filters: {
  query?: string;
  city?: string;
  province?: string;
  places: boolean[];
  groups: boolean[];
  levels: boolean[];
}): Promise<SelectTrainerWithUser[]> {
  const conditions = [eq(trainers.is_visible, true)];

  if (filters.query) {
    conditions.push(
      sql`(${users.name} || ' ' || ${users.surname}) ILIKE ${`%${filters.query}%`}`
    );
  }

  if (filters.city) conditions.push(eq(trainers.city, filters.city));
  if (filters.province) conditions.push(eq(trainers.province, filters.province));

  const placesFilter = boolArrayFilter(trainers.places, filters.places);
  if (placesFilter) conditions.push(placesFilter);

  const groupsFilter = boolArrayFilter(trainers.groups, filters.groups);
  if (groupsFilter) conditions.push(groupsFilter);

  const levelsFilter = boolArrayFilter(trainers.levels, filters.levels);
  if (levelsFilter) conditions.push(levelsFilter);

  return db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(...conditions))
    .orderBy(desc(trainers.created_at));
}
