const { UnauthorizedError, ForbiddenError } = require("../utils/customErrors");

// Restricts access to users whose role matches one of the allowed roles.
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Unauthorized"));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ForbiddenError("Forbidden"));
  }
  next();
};

module.exports = { authorize };
