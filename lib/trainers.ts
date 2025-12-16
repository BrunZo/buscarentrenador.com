import pool from './db';

export interface Trainer {
  id: number;
  user_id: number;
  name: string;
  surname: string;
  city: string;
  province: string;
  description: string;
  hourly_rate: number;
  levels: string[];
  places: string[];
  groups: string[];
  certifications: string[];
  created_at: Date;
  updated_at: Date;
}

export async function getTrainerByUserId(userId: number): Promise<Trainer | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT t.*, u.name, u.surname 
       FROM trainers t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function createTrainerProfile(
  userId: number,
  city: string,
  province: string,
  description: string,
  hourlyRate: number,
  specialties: string[],
  experienceYears: number,
  certifications: string[]
): Promise<Trainer> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO trainers (user_id, city, province, description, hourly_rate, specialties, experience_years, certifications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, city, province, description, hourlyRate, specialties, experienceYears, certifications]
    );
    // Fetch the trainer with user name and surname
    const trainerResult = await client.query(
      `SELECT t.*, u.name, u.surname 
       FROM trainers t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = $1`,
      [result.rows[0].id]
    );
    return trainerResult.rows[0];
  } finally {
    client.release();
  }
}

export async function updateTrainerProfile(
  trainerId: number,
  updates: Partial<Omit<Trainer, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'name' | 'surname'>>
): Promise<Trainer | null> {
  const client = await pool.connect();
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE trainers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    
    await client.query(query, [trainerId, ...values]);
    
    // Fetch the updated trainer with user name and surname
    const trainerResult = await client.query(
      `SELECT t.*, u.name, u.surname 
       FROM trainers t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = $1`,
      [trainerId]
    );
    return trainerResult.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getAllTrainers(): Promise<Trainer[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT t.*, u.name, u.surname 
       FROM trainers t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getTrainersByFilters(filters: {
  query?: string,
  city?: string,
  prov?: string,
  place: boolean[],
  group: boolean[],
  level: boolean[]
}): Promise<Trainer[]> {
  const client = await pool.connect();
  try {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.query) {
      conditions.push(`((u.name || ' ' || u.surname) ILIKE $${paramIndex})`);
      params.push(`%${filters.query}%`);
      paramIndex++;
    }
    if (filters.city) {
      conditions.push(`t.city = $${paramIndex}`);
      params.push(filters.city);
      paramIndex++;
    }
    if (filters.prov) {
      conditions.push(`t.province = $${paramIndex}`);
      params.push(filters.prov);
      paramIndex++;
    }
    
    if (filters.place.some(v => v === true)) {
      conditions.push(`((t.places[1] = $${paramIndex}[1]) OR (t.places[2] = $${paramIndex}[2]) OR (t.places[3] = $${paramIndex}[3]))`);
      params.push(filters.place);
      paramIndex++;
    }
    
    if (filters.group.some(v => v === true)) {
      conditions.push(`((t.groups[1] = $${paramIndex}[1]) OR (t.groups[2] = $${paramIndex}[2]))`);
      params.push(filters.group);
      paramIndex++;
    }
    
    if (filters.level.some(v => v === true)) {
      conditions.push(`((t.levels[1] = $${paramIndex}[1]) OR (t.levels[2] = $${paramIndex}[2]) OR (t.levels[3] = $${paramIndex}[3]) OR (t.levels[4] = $${paramIndex}[4]) OR (t.levels[5] = $${paramIndex}[5]))`);
      params.push(filters.level);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const queryString = `SELECT t.*, u.name, u.surname 
                         FROM trainers t 
                         JOIN users u ON t.user_id = u.id 
                         ${whereClause} 
                         ORDER BY t.created_at DESC`;
    
    const result = await client.query(queryString, params);
    return result.rows;
  } finally {
    client.release();
  }
}
