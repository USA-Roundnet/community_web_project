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

const startGoogleAuth = asyncHandler(async (req, res) => {
  const authUrl = authService.buildGoogleAuthUrl(req.query?.state);
  res.redirect(authUrl);
});

const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { token } = await authService.authenticateWithGoogleCode(code);
    const redirectUrl = new URL("/login", frontendUrl);
    redirectUrl.searchParams.set("token", token);
    res.redirect(redirectUrl.toString());
  } catch (error) {
    const redirectUrl = new URL("/login", frontendUrl);
    redirectUrl.searchParams.set(
      "error",
      error?.message || "Google authentication failed"
    );
    res.redirect(redirectUrl.toString());
  }
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
  startGoogleAuth,
  handleGoogleCallback,
  forgotPassword,
  resetPassword
};
