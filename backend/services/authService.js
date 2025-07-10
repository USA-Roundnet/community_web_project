const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../knex-config");
const crypto = require("crypto-random-string");
const { sendEmail } = require("../utils/emailUtils");

// Register a new user
const registerUser = async (userData) => {
  //console.log("Received userData:", userData);

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
};

// Log in a user
const loginUser = async ({ email, password }) => {
  // Find the user by email
  const user = await db("User").where({ email }).first();

  // If the user doesn't exist or the password doesn't match, throw an error
  // TODO: should encrypt on client
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  // Generate a JWT token for the user
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token; // Return the generated token
};

// Request password reset
const forgotPassword = async (email) => {
  // Find the user by email
  const user = await db("User").where({ email }).first();

  // If user doesn't exist, throw an error
  if (!user) {
    throw new Error("User with this email does not exist");
  }

  // Generate a secure random token
  const token = crypto({ length: 32, type: "url-safe" });

  // Set token expiration (1 hour from now)
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  // Save token and expiration to database
  await db("User")
    .where({ email })
    .update({
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
  await sendEmail(email, "Rally Point - Password Reset", emailHtml);

  return { message: "Password reset email sent" };
};

// Reset password using token
const resetPassword = async (token, newPassword) => {
  // Find user with this token and check if token is still valid
  const user = await db("User")
    .where({ reset_password_token: token })
    .andWhere("reset_password_expires", ">", new Date())
    .first();

  if (!user) {
    throw new Error("Invalid or expired password reset token");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password and clear the reset token fields
  await db("User")
    .where({ id: user.id })
    .update({
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
