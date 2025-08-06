class UserNotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
    this.statusCode = 404;
  }
}

class InvalidCredentialsError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
    this.statusCode = 401;
  }
}

class InvalidTokenError extends Error {
  constructor(message = "Invalid or expired token") {
    super(message);
    this.name = "InvalidTokenError";
    this.statusCode = 400;
  }
}

class ValidationError extends Error {
  constructor(message = "Validation failed") {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class DuplicateError extends Error {
  constructor(message = "Resource already exists") {
    super(message);
    this.name = "DuplicateError";
    this.statusCode = 409;
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  ValidationError,
  DuplicateError
};
