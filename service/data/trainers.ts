import { eq, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/index';
import { trainers, users, type TrainerWithUser, type NewTrainer } from '../db/schema';
import { Result } from '../model';

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
 * Server actions:
 * 
 * createTrainerProfile(new_trainer)
 *  returns: trainer_id  
 *  errors: server-error
 * 
 * updateTrainerProfile(trainerId, updates)
 *  returns: trainer
 *  errors: not-found, server-error
 * 
 * getTrainerById(id)
 *  returns: trainer
 *  errors: not-found, server-error
 * 
 * getTrainerByUserId(userId)
 *  returns: trainer
 *  errors: not-found, server-error
 * 
 * getAllTrainers()
 *  returns: trainers[]
 *  errors: server-error
 * 
 * getTrainersByFilters(filters)
 *  returns: trainers[]
 *  errors: server-error
 * 
 * setTrainerVisibility(trainerId, isVisible)
 *  returns: trainer
 *  errors: not-found, server-error
 */

export async function createTrainerProfile(
  new_trainer: NewTrainer
): Promise<Result<{ trainer_id: number }, 'server-error'>> {
  try {
    const result = await db
      .insert(trainers)
      .values(new_trainer)
      .returning({ trainer_id: trainers.id });
    const { trainer_id } = result[0];
    return { success: true, data: { trainer_id } };
  } catch (error) {
    console.error("Error creating trainer profile:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function updateTrainerProfile(
  trainerId: number,
  updates: Partial<Omit<TrainerWithUser, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'name' | 'surname' | 'email'>>
): Promise<Result<{ trainer_id: number }, 'not-found' | 'server-error'>> {
  try {
    const updatesWithoutUndefined: Partial<TrainerWithUser> = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));
    if (Object.keys(updatesWithoutUndefined).length === 0) {
      return { success: false, error: 'not-found' };
    }
    updatesWithoutUndefined.updated_at = new Date();

    const result = await db
      .update(trainers)
      .set(updatesWithoutUndefined)
      .where(eq(trainers.id, trainerId))
      .returning({ trainer_id: trainers.id });
    
    if (result.length === 0) {
      return { success: false, error: 'not-found' };
    }
    
    const { trainer_id } = result[0];
    return { success: true, data: { trainer_id } };
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getTrainerById(id: number): Promise<Result<TrainerWithUser, 'not-found' | 'server-error'>> {
  try {
    const [result] = await db
      .select(getTrainerWithUserSelect())
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.id, id))
      .limit(1);
    
    if (!result) {
      return { success: false, error: 'not-found' };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting trainer by id:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getTrainerByUserId(userId: number): Promise<Result<TrainerWithUser, 'not-found' | 'server-error'>> {
  try {
    const [result] = await db
      .select(getTrainerWithUserSelect())
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.user_id, userId))
      .limit(1);
    
    if (!result) {
      return { success: false, error: 'not-found' };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting trainer by user id:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getAllTrainers(): Promise<Result<TrainerWithUser[], 'server-error'>> {
  try {
    const result = await db
      .select(getTrainerWithUserSelect())
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.is_visible, true))
      .orderBy(desc(trainers.created_at));
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting all trainers:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function getTrainersByFilters(filters: {
  query?: string,
  city?: string,
  prov?: string,
  place: boolean[],
  group: boolean[],
  level: boolean[]
}): Promise<Result<TrainerWithUser[], 'server-error'>> {
  try {
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

    if (filters.prov) {
      conditions.push(eq(trainers.province, filters.prov));
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
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting trainers by filters:", error);
    return { success: false, error: 'server-error' };
  }
}

export async function setTrainerVisibility(trainerId: number, isVisible: boolean): Promise<Result<{ trainer_id: number }, 'not-found' | 'server-error'>> {
  try {
    const result = await db
      .update(trainers)
      .set({
        is_visible: isVisible,
        updated_at: new Date(),
      })
      .where(eq(trainers.id, trainerId))
      .returning({ trainer_id: trainers.id });
    
    if (result.length === 0) {
      return { success: false, error: 'not-found' };
    }

    const { trainer_id } = result[0];
    return { success: true, data: { trainer_id } };
  } catch (error) {
    console.error("Error setting trainer visibility:", error);
    return { success: false, error: 'server-error' };
  }
}
