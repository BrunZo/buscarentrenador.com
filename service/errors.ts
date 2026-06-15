export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly clientMessage: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class JsonError extends AppError {
  constructor() {
    super("Invalid JSON", 400, "Cuerpo de solicitud inválido");
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized", 401, "No autorizado. Debes iniciar sesión.");
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("Forbidden", 403, "No tenés permisos para realizar esta acción.");
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404, "Usuario no encontrado");
  }
}

export class TrainerNotFoundError extends AppError {
  constructor() {
    super("Trainer not found", 404, "No se encontró el perfil de entrenador");
  }
}

export class ServerError extends AppError {
  constructor(message?: string) {
    super(message || "Server error", 500, "Error interno del servidor");
  }
}
