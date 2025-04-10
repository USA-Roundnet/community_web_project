const { validateUserData } = require("../utils/validation");

const validateUserInput = (req, res, next) => {
  const errors = validateUserData(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(", ") });
  }

  next(); // Proceed to the next middleware or controller
};

module.exports = validateUserInput;
