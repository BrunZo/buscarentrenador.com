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
