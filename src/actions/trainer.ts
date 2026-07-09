"use server";

import { z } from "zod";
import {
  createOrUpdateTrainer,
  updateTrainerVisibility,
} from "@/service/trainers";
import { authedAction } from "./lib";

const trainerSchema = z.object({
  province_id: z.number().int().optional(),
  city_id: z.number().int().optional(),
  description: z.string().max(2000).optional(),
  places: z.array(z.boolean()).length(3).optional(),
  groups: z.array(z.boolean()).length(3).optional(),
  levels: z.array(z.boolean()).length(5).optional(),
  certifications: z.array(z.string().max(200)).max(20).optional(),
  soy_exo: z.boolean().optional(),
  examenes_oma: z.boolean().optional(),
});

export const saveTrainer = authedAction(
  trainerSchema,
  async (data, { user }) => {
    await createOrUpdateTrainer(user.id, data);
    return { message: "Información de entrenador guardada exitosamente" };
  },
);

const visibilitySchema = z.object({ is_visible: z.boolean() });

export const setTrainerVisibility = authedAction(
  visibilitySchema,
  async ({ is_visible }, { user }) => {
    await updateTrainerVisibility(user.id, is_visible);
    return {
      message: is_visible
        ? "Tu perfil ahora es visible para los usuarios."
        : "Tu perfil ha sido ocultado de las búsquedas.",
    };
  },
);
