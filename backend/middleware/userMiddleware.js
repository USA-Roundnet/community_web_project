const { validateUserData } = require("../utils/validation");
const { ValidationError } = require("../utils/customErrors");

const validateUserInput = (req, res, next) => {
  const errors = validateUserData(req.body);

  if (errors.length > 0) {
    return next(new ValidationError(errors.join(", ")));
  }

  next(); // Proceed to the next middleware or controller
};

module.exports = validateUserInput;
