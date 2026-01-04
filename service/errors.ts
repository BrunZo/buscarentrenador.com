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

export class UserAlreadyExistsError extends Error {
  constructor() { 
    super("User already exists");
    this.name = "UserAlreadyExistsError";
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

