/**
 * Custom error classes for authentication and user operations
 */

export class JsonError extends Error {
  constructor() { 
    super("Invalid JSON");
    this.name = "JsonError";
  }
}

export class UnauthorizedError extends Error {
  constructor() { 
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class UserNotFoundError extends Error {
  constructor() { 
    super("User not found");
    this.name = "UserNotFoundError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() { 
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export class EmailNotVerifiedError extends Error {
  constructor() { 
    super("Email not verified");
    this.name = "EmailNotVerifiedError";
  }
}

export class AlreadyVerifiedError extends Error {
  constructor() { 
    super("Email already verified");
    this.name = "AlreadyVerifiedError";
  }
}

export class InvalidTokenError extends Error {
  constructor() { 
    super("Invalid verification token");
    this.name = "InvalidTokenError";
  }
}

export class TokenExpiredError extends Error {
  constructor() { 
    super("Verification token expired");
    this.name = "TokenExpiredError";
  }
}

export class InvalidResetTokenError extends Error {
  constructor() { 
    super("Invalid password reset token");
    this.name = "InvalidResetTokenError";
  }
}

export class ResetTokenExpiredError extends Error {
  constructor() { 
    super("Password reset token expired");
    this.name = "ResetTokenExpiredError";
  }
}

export class EmailAlreadyInUseError extends Error {
  constructor() { 
    super("Email already in use");
    this.name = "EmailAlreadyInUseError";
  }
}

export class TrainerNotFoundError extends Error {
  constructor() { 
    super("Trainer not found");
    this.name = "TrainerNotFoundError";
  }
}

export class ServerError extends Error {
  constructor(message?: string) { 
    super(message || "Server error");
    this.name = "ServerError";
  }
}
