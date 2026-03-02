const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../knex-config");
const crypto = require("crypto");
const { sendEmail } = require("../utils/emailUtils");
const { validateUserData } = require("../utils/validation");
const {
  UserNotFoundError,
  InvalidCredentialsError,
  InvalidTokenError,
  DuplicateError,
  ValidationError,
} = require("../utils/customErrors");
const { getJwtSecret } = require("../utils/authConfig");

function generateRandomToken(length = 32) {
  // Node 16+ supports 'base64url'
  // length here = number of random bytes, not characters.
  return crypto.randomBytes(length).toString("base64url");
}

// Register a new user
const registerUser = async (userData) => {
  //console.log("Received userData:", userData);

  // Validate user data
  const validationErrors = validateUserData(userData);
  if (validationErrors.length > 0) {
    throw new ValidationError(validationErrors.join(", "));
  }

  const {
    first_name,
    last_name,
    username,
    email,
    password,
    gender,
    city,
    state_province,
    zip_code,
    country,
    phone_number,
    date_of_birth,
    profile_picture_url = null,
  } = userData;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userId] = await db("User").insert({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword,
      gender,
      city,
      state_province,
      zip_code,
      country,
      phone_number,
      date_of_birth,
      profile_picture_url,
      auth_provider: "local",
    });

    const newUser = await db("User").where({ id: userId }).first();

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      gender: newUser.gender,
      city: newUser.city,
      country: newUser.country,
    };
  } catch (error) {
    // Handle duplicate key errors from database constraints
    if (
      error.code === "ER_DUP_ENTRY" ||
      error.code === "SQLITE_CONSTRAINT" ||
      error.constraint
    ) {
      if (error.message.toLowerCase().includes("email")) {
        throw new DuplicateError("A user with this email already exists");
      } else if (error.message.toLowerCase().includes("username")) {
        throw new DuplicateError("A user with this username already exists");
      } else {
        throw new DuplicateError("A user with these details already exists");
      }
    }
    // Re-throw other errors
    throw error;
  }
};

// Log in a user
const loginUser = async ({ email, password }) => {
  // Find the user by email
  const user = await db("User").where({ email }).first();

  // If the user doesn't exist or the password doesn't match, throw an error
  // TODO: should encrypt on client
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new InvalidCredentialsError("Invalid email or password");
  }

  // Generate a JWT token for the user
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role || "user" },
    getJwtSecret(),
    { expiresIn: "1h" }
  );

  return token; // Return the generated token
};

// Request password reset
const forgotPassword = async (email) => {
  // Basic email validation
  if (!email || !email.trim()) {
    throw new ValidationError("Email is required");
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!validEmail.test(email.trim())) {
    throw new ValidationError("Invalid email format");
  }

  // Find the user by email
  const user = await db("User").where({ email: email.trim() }).first();

  // If user doesn't exist, throw an error
  if (!user) {
    throw new UserNotFoundError("User with this email does not exist");
  }

  // Generate a secure random token
  const token = generateRandomToken(32);

  // Set token expiration (1 hour from now)
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  // Save token and expiration to database
  await db("User").where({ email: email.trim() }).update({
    reset_password_token: token,
    reset_password_expires: expires,
  });

  // Construct reset URL
  const resetUrl = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password/${token}`;

  // HTML email template
  const emailHtml = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset for your Rally Point account.</p>
    <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
    <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #225975; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <p>Regards,<br>The Rally Point Team</p>
  `;

  // Send password reset email
  await sendEmail(email.trim(), "Rally Point - Password Reset", emailHtml);

  return { message: "Password reset email sent" };
};

// Reset password using token
const resetPassword = async (token, newPassword) => {
  // Basic validation
  if (!token || !token.trim()) {
    throw new ValidationError("Reset token is required");
  }

  if (!newPassword || newPassword.length < 6) {
    throw new ValidationError("Password must be at least 6 characters long");
  }

  // Find user with this token and check if token is still valid
  const user = await db("User")
    .where({ reset_password_token: token.trim() })
    .andWhere("reset_password_expires", ">", new Date())
    .first();

  if (!user) {
    throw new InvalidTokenError("Invalid or expired password reset token");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token fields
  await db("User").where({ id: user.id }).update({
    password: hashedPassword,
    reset_password_token: null,
    reset_password_expires: null,
  });

  return { message: "Password has been reset successfully" };
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
