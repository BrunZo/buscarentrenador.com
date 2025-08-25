import pool from './db';

export interface Trainer {
  id: number;
  user_id: number;
  city: string;
  province: string;
  description: string;
  hourly_rate: number;
  specialties: string[];
  experience_years: number;
  certifications: string[];
  created_at: Date;
  updated_at: Date;
}

export async function getTrainerByUserId(userId: number): Promise<Trainer | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM trainers WHERE user_id = $1',
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
    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function updateTrainerProfile(
  trainerId: number,
  updates: Partial<Omit<Trainer, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<Trainer | null> {
  const client = await pool.connect();
  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE trainers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
    
    const result = await client.query(query, [trainerId, ...values]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export async function getAllTrainers(): Promise<Trainer[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM trainers ORDER BY created_at DESC');
    return result.rows;
  } finally {
    client.release();
  }
}
