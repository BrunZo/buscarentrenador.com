import { PublicUser } from "./users";

export type TrainerStatus = "pending" | "approved" | "rejected";

export type TrainerSchema = {
  id: number;
  user_id: string;
  city?: string | null;
  province?: string | null;
  description?: string | null;
  places?: boolean[] | null;
  groups?: boolean[] | null;
  levels?: boolean[] | null;
  hourly_rate?: string | null;
  certifications?: string[] | null;
  is_visible?: boolean | null;
  status: TrainerStatus;
  soy_exo?: boolean | null;
  examenes_oma?: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type NewTrainer = Pick<
  TrainerSchema,
  | "user_id"
  | "city"
  | "province"
  | "description"
  | "places"
  | "groups"
  | "levels"
  | "hourly_rate"
  | "certifications"
  | "is_visible"
  | "soy_exo"
  | "examenes_oma"
>;

export type UpdateTrainer = Pick<
  TrainerSchema,
  | "city"
  | "province"
  | "description"
  | "places"
  | "groups"
  | "levels"
  | "hourly_rate"
  | "certifications"
  | "is_visible"
  | "status"
  | "soy_exo"
  | "examenes_oma"
>;

export type SelectTrainer = Pick<
  TrainerSchema,
  | "id"
  | "city"
  | "province"
  | "description"
  | "places"
  | "groups"
  | "levels"
  | "hourly_rate"
  | "certifications"
  | "is_visible"
  | "status"
  | "soy_exo"
  | "examenes_oma"
  | "created_at"
  | "updated_at"
>;

export type PublicTrainer = Pick<
  TrainerSchema,
  | "id"
  | "city"
  | "province"
  | "description"
  | "places"
  | "groups"
  | "levels"
  | "hourly_rate"
  | "certifications"
  | "is_visible"
  | "status"
  | "soy_exo"
  | "examenes_oma"
>;

export type PublicTrainerUser = PublicTrainer & Omit<PublicUser, "email">;

// email is fetched separately and is null for unauthenticated viewers
export type TrainerWithEmail = PublicTrainerUser & { email: string | null };
