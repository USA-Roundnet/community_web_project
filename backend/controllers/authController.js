const authService = require("../services/authService");
const asyncHandler = require("../middleware/asyncHandler");
const {
  UserNotFoundError,
  InvalidTokenError,
  ValidationError,
} = require("../utils/customErrors");

const registerUser = asyncHandler(async (req, res) => {
  const newUser = await authService.registerUser(req.body);
  res.status(201).json(newUser);
});

const loginUser = asyncHandler(async (req, res) => {
  const token = await authService.loginUser(req.body);
  res.status(200).json({ token });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ValidationError("Email is required");

  try {
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    // Don't expose whether the email exists for security reasons
    if (error instanceof UserNotFoundError) {
      return res.status(200).json({
        message:
          "If your email exists in our system, a password reset link has been sent",
      });
    }
    throw error;
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ValidationError("Token and password are required");
  }

  try {
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof InvalidTokenError || error instanceof ValidationError) {
      throw error;
    }
    throw error;
  }
});

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};
