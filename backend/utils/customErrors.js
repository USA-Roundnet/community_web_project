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

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message = "Bad request") {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

module.exports = {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  ValidationError,
  DuplicateError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
};
