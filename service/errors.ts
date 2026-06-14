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

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 401, "Correo electrónico o contraseña incorrectos");
  }
}

export class EmailNotVerifiedError extends AppError {
  constructor() {
    super("Email not verified", 403, "Tu correo electrónico no está verificado");
  }
}

export class AlreadyVerifiedError extends AppError {
  constructor() {
    super("Email already verified", 400, "El correo ya está verificado");
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super("Invalid verification token", 400, "Token inválido");
  }
}

export class TokenExpiredError extends AppError {
  constructor() {
    super("Verification token expired", 400, "El token ha expirado");
  }
}

export class InvalidResetTokenError extends AppError {
  constructor() {
    super("Invalid password reset token", 400, "Token de reseteo inválido o ya utilizado");
  }
}

export class ResetTokenExpiredError extends AppError {
  constructor() {
    super("Password reset token expired", 400, "El token de reseteo ha expirado. Por favor, solicitá uno nuevo.");
  }
}

export class EmailAlreadyInUseError extends AppError {
  constructor() {
    super("Email already in use", 400, "El correo electrónico ya está en uso");
  }
}

export class EmailRegisteredWithGoogleError extends AppError {
  constructor() {
    super("Email registered with Google", 409, "Esta cuenta está registrada con Google. Iniciá sesión con Google.");
  }
}

export class EmailRegisteredWithCredentialsError extends AppError {
  constructor() {
    super("Email registered with credentials", 409, "Esta cuenta está registrada con email y contraseña. Iniciá sesión con tu contraseña.");
  }
}

export class TrainerNotFoundError extends AppError {
  constructor() {
    super("Trainer not found", 404, "No se encontró el perfil de entrenador");
  }
}

export class ServerError extends AppError {
  constructor(message?: string) {
    const msg = message || "Server error";
    super(msg, 500, msg);
  }
}
