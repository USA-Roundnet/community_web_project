const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../knex-config");

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

module.exports = {
  registerUser,
  loginUser,
};
