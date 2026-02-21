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

const GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

function generateRandomToken(length = 32) {
  // Node 16+ supports 'base64url'
  // length here = number of random bytes, not characters.
  return crypto.randomBytes(length).toString("base64url");
}

const generateJwtToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

const getGoogleOauthConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    "http://localhost:5000/api/auth/google/callback";

  if (!clientId) {
    throw new ValidationError("Google OAuth is not configured");
  }

  return { clientId, clientSecret, redirectUri };
};

const buildGoogleAuthUrl = (state) => {
  const { clientId, redirectUri } = getGoogleOauthConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    include_granted_scopes: "true",
    prompt: "select_account",
  });

  if (state) {
    params.set("state", state);
  }

  return `${GOOGLE_AUTH_BASE_URL}?${params.toString()}`;
};

const parseGoogleName = (profile) => {
  const rawFullName = profile.name?.trim() || "";
  const splitName = rawFullName ? rawFullName.split(/\s+/) : [];
  const first_name = (profile.given_name || splitName[0] || "Google").slice(
    0,
    255
  );
  const derivedLastName = splitName.length > 1 ? splitName.slice(1).join(" ") : "";
  const last_name = (
    profile.family_name ||
    derivedLastName ||
    "User"
  ).slice(0, 255);
  const name = rawFullName || `${first_name} ${last_name}`.trim();

  return { first_name, last_name, name };
};

const normalizeUsernameBase = (email) => {
  const local = (email || "google_user").split("@")[0];
  const sanitized = local.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32);
  return sanitized || "google_user";
};

const generateUniqueUsername = async (base) => {
  let candidate = base;
  let exists = await db("User").where({ username: candidate }).first();
  while (exists) {
    const suffix = crypto.randomBytes(3).toString("hex");
    candidate = `${base.slice(0, 24)}_${suffix}`;
    exists = await db("User").where({ username: candidate }).first();
  }
  return candidate;
};

const upsertGoogleUser = async (profile) => {
  if (!profile?.sub || !profile?.email) {
    throw new ValidationError("Google profile is missing required fields");
  }

  const { first_name, last_name, name } = parseGoogleName(profile);

  try {
    // Prefer match by google_id to preserve account linkage.
    const existingByGoogleId = await db("User")
      .where({ google_id: profile.sub })
      .first();
    if (existingByGoogleId) {
      await db("User").where({ id: existingByGoogleId.id }).update({
        email: profile.email,
        first_name,
        last_name,
        name,
        auth_provider: "google",
      });
      return db("User").where({ id: existingByGoogleId.id }).first();
    }

    // If a local account already exists, link Google to it.
    const existingByEmail = await db("User").where({ email: profile.email }).first();
    if (existingByEmail) {
      await db("User").where({ id: existingByEmail.id }).update({
        first_name: existingByEmail.first_name || first_name,
        last_name: existingByEmail.last_name || last_name,
        name,
        auth_provider: "google",
        google_id: profile.sub,
      });
      return db("User").where({ id: existingByEmail.id }).first();
    }

    // Create a new user with sensible defaults for required profile fields.
    const username = await generateUniqueUsername(
      normalizeUsernameBase(profile.email)
    );
    const [userId] = await db("User").insert({
      role: "user",
      first_name,
      last_name,
      name,
      username,
      gender: "other",
      email: profile.email,
      city: "Unknown",
      state_province: "Unknown",
      zip_code: "00000",
      country: "Unknown",
      phone_number: "0000000000",
      date_of_birth: "1970-01-01",
      password: null,
      auth_provider: "google",
      google_id: profile.sub,
    });

    return db("User").where({ id: userId }).first();
  } catch (error) {
    if (
      error.code === "ER_DUP_ENTRY" ||
      error.code === "SQLITE_CONSTRAINT" ||
      error.constraint
    ) {
      throw new DuplicateError(
        "Google account could not be linked due to an existing user conflict"
      );
    }
    throw error;
  }
};

const exchangeGoogleCodeForAccessToken = async (code) => {
  const { clientId, clientSecret, redirectUri } = getGoogleOauthConfig();

  if (!clientSecret) {
    throw new ValidationError("Google OAuth is not configured");
  }

  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenBody = await tokenRes.json();
  if (!tokenRes.ok || !tokenBody.access_token) {
    throw new InvalidCredentialsError("Google authentication failed");
  }

  return tokenBody.access_token;
};

const fetchGoogleUserProfile = async (accessToken) => {
  const profileRes = await fetch(GOOGLE_USERINFO_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const profileBody = await profileRes.json();
  if (!profileRes.ok) {
    throw new InvalidCredentialsError("Google authentication failed");
  }

  return profileBody;
};

const authenticateWithGoogleCode = async (code) => {
  if (!code) {
    throw new ValidationError("Authorization code is required");
  }

  const accessToken = await exchangeGoogleCodeForAccessToken(code);
  const profile = await fetchGoogleUserProfile(accessToken);
  const user = await upsertGoogleUser(profile);
  const token = generateJwtToken(user);

  return { token, user };
};

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
      name: `${first_name} ${last_name}`.trim(),
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
  const token = generateJwtToken(user);

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
  buildGoogleAuthUrl,
  authenticateWithGoogleCode,
  forgotPassword,
  resetPassword,
};
