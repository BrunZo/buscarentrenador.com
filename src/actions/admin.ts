"use server";

import { z } from "zod";
import { updateTrainer } from "@/service/trainers";
import { TrainerNotFoundError } from "@/service/errors";
import { authedAction } from "./lib";

const decisionSchema = z.object({
  id: z.number().int(),
  status: z.enum(["approved", "rejected"]),
});

export const decideTrainer = authedAction(
  decisionSchema,
  async ({ id, status }) => {
    const updated = await updateTrainer(id, { status });
    if (!updated) throw new TrainerNotFoundError();
    return {
      message:
        status === "approved" ? "Entrenador aprobado." : "Entrenador rechazado.",
    };
  },
  { role: "admin" },
);
