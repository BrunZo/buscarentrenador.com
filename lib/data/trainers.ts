import { eq, and, or, desc, sql } from 'drizzle-orm';
import { db } from '../db/index';
import { trainers, users, type TrainerWithUser, type NewTrainer, Trainer } from '../db/schema';

export async function createTrainerProfile(
  new_trainer: NewTrainer
): Promise<Trainer> {
  try {
    const [trainer] = await db
      .insert(trainers)
      .values({
        user_id: new_trainer.user_id,
        city: new_trainer.city,
        province: new_trainer.province,
        description: new_trainer.description,
        places: new_trainer.places,
        groups: new_trainer.groups,
        levels: new_trainer.levels,
        hourly_rate: new_trainer.hourly_rate,
        certifications: new_trainer.certifications,
      })
      .returning();
    
    return trainer;
  } catch (error) {
    console.error("Error creating trainer profile:", error);
    throw error;
  }
}

export async function updateTrainerProfile(
  trainerId: number,
  updates: Partial<Omit<TrainerWithUser, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'name' | 'surname' | 'email'>>
): Promise<TrainerWithUser | null> {
  try {
    const updatesWithoutUndefined: any = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));
    
    if (Object.keys(updatesWithoutUndefined).length === 0) {
      return null;
    }

    updatesWithoutUndefined.updated_at = new Date();

    await db
      .update(trainers)
      .set(updatesWithoutUndefined)
      .where(eq(trainers.id, trainerId));

    // Reuse existing function to get trainer with user info
    return await getTrainerById(trainerId);
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return null;
  }
}

export async function getTrainerById(id: number): Promise<TrainerWithUser | null> {
  try {
    const [result] = await db
      .select({
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
      })
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.id, id))
      .limit(1);
    
    return result || null;
  } catch (error) {
    console.error("Error getting trainer by id:", error);
    return null;
  }
}

export async function getTrainerByUserId(userId: number): Promise<TrainerWithUser | null> {
  try {
    const [result] = await db
      .select({
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
      })
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.user_id, userId))
      .limit(1);
    
    return result || null;
  } catch (error) {
    console.error("Error getting trainer by user id:", error);
    return null;
  }
}

export async function getAllTrainers(): Promise<TrainerWithUser[]> {
  try {
    const result = await db
      .select({
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
      })
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(eq(trainers.is_visible, true))
      .orderBy(desc(trainers.created_at));
    
    return result;
  } catch (error) {
    console.error("Error getting all trainers:", error);
    return [];
  }
}

export async function getTrainersByFilters(filters: {
  query?: string,
  city?: string,
  prov?: string,
  place: boolean[],
  group: boolean[],
  level: boolean[]
}): Promise<TrainerWithUser[]> {
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
      .select({
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
      })
      .from(trainers)
      .innerJoin(users, eq(trainers.user_id, users.id))
      .where(and(...conditions))
      .orderBy(desc(trainers.created_at));
    
    return result;
  } catch (error) {
    console.error("Error getting trainers by filters:", error);
    return [];
  }
}

export async function setTrainerVisibility(trainerId: number, isVisible: boolean): Promise<TrainerWithUser | null> {
  try {
    await db
      .update(trainers)
      .set({
        is_visible: isVisible,
        updated_at: new Date(),
      })
      .where(eq(trainers.id, trainerId));

    // Reuse existing function to get trainer with user info
    return await getTrainerById(trainerId);
  } catch (error) {
    console.error("Error setting trainer visibility:", error);
    return null;
  }
}
