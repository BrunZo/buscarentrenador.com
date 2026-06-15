import { headers } from "next/headers";
import { ZodError, type z } from "zod";
import { auth } from "@/service/auth/auth";
import { AppError, UnauthorizedError, ForbiddenError } from "@/service/errors";
import type { SessionUser } from "@/types/users";

// Discriminated result returned by every action. Mirrors the old HTTP routes:
// success carries a user-facing `message`, failure carries `error` (the
// AppError.clientMessage). The UI branches on `ok` instead of `response.ok`.
export type ActionResult<T = undefined> =
  | { ok: true; message: string; data?: T }
  | { ok: false; error: string };

type ActionContext = { user: SessionUser };

type Handler<I, T> = (
  input: I,
  ctx: ActionContext,
) => Promise<{ message: string; data?: T }>;

// Wraps a server action with the same guarantees the route handlers gave:
// 1. session is verified (and role, if required) — actions are public POST
//    endpoints, so this check is mandatory, not optional.
// 2. input is parsed with Zod (it is still untrusted, just like a request body).
// 3. AppError/ZodError are mapped to a client-safe `error` string.
export function authedAction<S extends z.ZodType, T = undefined>(
  schema: S,
  handler: Handler<z.infer<S>, T>,
  opts: { role?: "admin" } = {},
) {
  return async (raw: z.input<S>): Promise<ActionResult<T>> => {
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user?.id) throw new UnauthorizedError();
      if (opts.role === "admin" && session.user.role !== "admin") {
        throw new ForbiddenError();
      }

      const input = schema.parse(raw);
      const { message, data } = await handler(input, {
        user: session.user as SessionUser,
      });
      return { ok: true, message, data };
    } catch (error) {
      if (error instanceof ZodError) {
        return { ok: false, error: error.issues[0]?.message ?? "Datos inválidos" };
      }
      if (error instanceof AppError) {
        return { ok: false, error: error.clientMessage };
      }
      console.error("Unhandled action error:", error);
      return { ok: false, error: "Error interno del servidor" };
    }
  };
}
