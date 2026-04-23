import { SelectUser, UserInfo, UserSchema } from "./users";

export type TrainerSchema = {
  id: number;
  user_id: number;
  city?: string | null;
  province?: string | null;
  description?: string | null;
  places?: boolean[] | null;
  groups?: boolean[] | null;
  levels?: boolean[] | null;
  hourly_rate?: string | null;
  certifications?: string[] | null;
  is_visible?: boolean | null;
  soy_exo?: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export type NewTrainer = Pick<TrainerSchema, 'user_id' | 'city' | 'province' | 'description' | 'places' | 'groups' | 'levels' | 'hourly_rate' | 'certifications' | 'is_visible' | 'soy_exo'>;

export type UpdateTrainer = Pick<TrainerSchema, 'city' | 'province' | 'description' | 'places' | 'groups' | 'levels' | 'hourly_rate' | 'certifications' | 'is_visible' | 'soy_exo'>;

export type SelectTrainer = Pick<TrainerSchema, 'id' | 'city' | 'province' | 'description' | 'places' | 'groups' | 'levels' | 'hourly_rate' | 'certifications' | 'is_visible' | 'soy_exo' | 'created_at' | 'updated_at'>;

export type TrainerInfo = Pick<TrainerSchema, 'city' | 'province' | 'description' | 'places' | 'groups' | 'levels' | 'hourly_rate' | 'certifications' | 'is_visible' | 'soy_exo' | 'id'>;

export type SelectTrainerWithUser = SelectTrainer & SelectUser;

export type TrainerWithUserInfo = TrainerInfo & UserInfo;
