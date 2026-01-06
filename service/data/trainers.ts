import { eq, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/index';
import { trainers, users, type TrainerWithUser, type NewTrainer } from '../db/schema';
import { TrainerNotFoundError } from '../errors';

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
  };
}

/**
 * @param new_trainer 
 * @returns The new trainer ID. 
 */
export async function createTrainer(
  new_trainer: NewTrainer
): Promise<{ trainer_id: number }> {
  const [trainer_id] = await db
    .insert(trainers)
    .values(new_trainer)
    .returning({ trainer_id: trainers.id });

  return trainer_id;
}

/**
 * 
 * @param trainerId 
 * @param updates 
 * @returns 
 * @throws TrainerNotFoundError 
 */
export async function updateTrainer(
  trainerId: number,
  updates: Partial<Omit<TrainerWithUser, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'name' | 'surname' | 'email'>>
): Promise<{ trainer_id: number }> {
  const updatesWithoutUndefined: Partial<TrainerWithUser> = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));
  updatesWithoutUndefined.updated_at = new Date();

  const [trainer_id] = await db
    .update(trainers)
    .set(updatesWithoutUndefined)
    .where(eq(trainers.id, trainerId))
    .returning({ trainer_id: trainers.id });
  
  if (!trainer_id) {
    throw new TrainerNotFoundError();
  }
  
  return trainer_id;
}

/**
 * Light-weight method to modify the visibility of a trainer.
 * If the @param isVisible is provided, then the visibility will be set to that value.
 * Otherwise, the visibility would be toggled (true <-> false).
 * @param trainerId 
 * @param isVisible
 * @returns 
 * @throws TrainerNotFoundError 
 */
export async function setTrainerVisibility(trainerId: number, isVisible: boolean): Promise<{ trainer_id: number }> {
  const [result] = await db
    .update(trainers)
    .set({
      is_visible: isVisible,
      updated_at: new Date(),
    })
    .where(eq(trainers.id, trainerId))
    .returning({ trainer_id: trainers.id });
  
  if (!result) {
    throw new TrainerNotFoundError();
  }

  return result;
}

/**
 * 
 * @param id 
 * @returns TrainerWithUser object
 * @throws TrainerNotFoundError 
 */
export async function getTrainerById(id: number): Promise<TrainerWithUser> {
  const [result] = await db 
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.id, id))
    .limit(1);
  
  if (!result) {
    throw new TrainerNotFoundError();
  }

  return result;
}

/**
 * 
 * @param user_id 
 * @returns TrainerWithUser object
 * @throws TrainerNotFoundError 
 */
export async function getTrainerByUserId(userId: number): Promise<TrainerWithUser> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);
  
  if (!result) {
    throw new TrainerNotFoundError();
  }

  return result;
}

/**
 * 
 * @param user_id 
 * @returns TrainerWithUser object
 * @throws TrainerNotFoundError 
 */
export async function isUserTrainer(userId: number): Promise<boolean> {
  const [result] = await db
    .select(getTrainerWithUserSelect())
    .from(trainers)
    .innerJoin(users, eq(trainers.user_id, users.id))
    .where(eq(trainers.user_id, userId))
    .limit(1);

  if (!result)
    return false;
  return true;
}

/**
 * 
 * @returns A list of TrainerWithUser objects
 */
export async function getAllTrainers(): Promise<TrainerWithUser[]> {
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
}): Promise<TrainerWithUser[]> {
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

