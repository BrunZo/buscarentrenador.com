import { eq, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/index';
import { trainers, users } from '../db/schema';
import type { NewTrainer, UpdateTrainer, SelectTrainerWithUser, SelectTrainer } from '../types/trainers';

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
    created_at: trainers.created_at,
    updated_at: trainers.updated_at,
    password_hash: users.password_hash,
    email_verified: users.email_verified,
  };
}

/**
 * @param new_trainer 
 * @returns The new trainer ID. 
 */
export async function createTrainer(new_trainer: NewTrainer): Promise<SelectTrainer | null> {
  const [result] = await db
    .insert(trainers)
    .values(new_trainer)
    .returning();

  return result;
}

/**
 * 
 * @param trainerId 
 * @param updates 
 * @returns 
 */
export async function updateTrainer(trainerId: number, updates: UpdateTrainer): Promise<SelectTrainer | null> {
  const [result] = await db
    .update(trainers) 
    .set(updates)
    .where(eq(trainers.id, trainerId))
    .returning();

  return result;
}

/**
 * 
 * @param id 
 * @returns TrainerWithUser object
 * @throws TrainerNotFoundError 
 */
export async function getTrainerById(id: number): Promise<SelectTrainerWithUser | null> {
  const [result] = await db 
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.id, id))
    .limit(1);

  return result;
}

/**
 * 
 * @param user_id 
 * @returns TrainerWithUser object
 * @throws TrainerNotFoundError 
 */
export async function getTrainerByUserId(userId: number): Promise<SelectTrainerWithUser | null> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);
  
  return result;
}

/**
 * 
 * @param user_id 
 */
export async function isUserTrainer(userId: number): Promise<boolean> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);

  return !!result;
}

/**
 * 
 * @returns A list of TrainerWithUser objects
 */
export async function getAllTrainers(): Promise<SelectTrainerWithUser[]> {
  const result = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.is_visible, true))
    .orderBy(desc(trainers.created_at));
    
  return result;
}

/**
 * 
 * @returns A list of TrainerWithUser objects
 */
export async function getTrainersByFilters(filters: {
  query?: string,
  city?: string,
  province?: string,
  place: boolean[],
  group: boolean[],
  level: boolean[]
}): Promise<SelectTrainerWithUser[]> {
  const conditions = [];  

  conditions.push(eq(trainers.is_visible, true));
  
  if (filters.query) {
    conditions.push(
      sql`(${users.name} || ' ' || ${users.surname}) ILIKE ${`%${filters.query}%`}`
    );
  }

  if (filters.city) {
    conditions.push(eq(trainers.city, filters.city));
  }

  if (filters.province) {
    conditions.push(eq(trainers.province, filters.province));
  }

  if (filters.place.some(v => v === true)) {
    const placeConditions = filters.place
      .map((value, index) => {
        if (value === true) {
          // PostgreSQL arrays are 1-indexed
          return sql`${trainers.places}[${index + 1}] = true`;
        }
        return null;
      })
      .filter((c): c is ReturnType<typeof sql> => c !== null);
    
    if (placeConditions.length > 0) {
      conditions.push(or(...placeConditions)!);
    }
  }

  if (filters.group.some(v => v === true)) {
    const groupConditions = filters.group
      .map((value, index) => {
        if (value === true) {
          return sql`${trainers.groups}[${index + 1}] = true`;
        }
        return null;
      })
      .filter((c): c is ReturnType<typeof sql> => c !== null);
    
    if (groupConditions.length > 0) {
      conditions.push(or(...groupConditions)!);
    }
  }

  if (filters.level.some(v => v === true)) {
    const levelConditions = filters.level
      .map((value, index) => {
        if (value === true) {
          return sql`${trainers.levels}[${index + 1}] = true`;
        }
        return null;
      })
      .filter((c): c is ReturnType<typeof sql> => c !== null);
    
    if (levelConditions.length > 0) {
      conditions.push(or(...levelConditions)!);
    }
  }

  const result = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(and(...conditions))
    .orderBy(desc(trainers.created_at));
    
  return result;
}
