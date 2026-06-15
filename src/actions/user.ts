"use server";

import { z } from "zod";
import { updateUserProfile } from "@/service/users";
import { authedAction } from "./lib";

const updateProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  surname: z.string().min(1, "El apellido es requerido").max(255),
});

export const updateProfile = authedAction(
  updateProfileSchema,
  async ({ name, surname }, { user }) => {
    await updateUserProfile(user.id, { name, surname });
    return { message: "Información actualizada correctamente." };
  },
);
