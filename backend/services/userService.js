const knex = require("../knex-config.js");
const { validateUserData } = require("../utils/validation.js");

const getAllUsers = async () => {
  return await knex("User").select("*");
};

const getUserById = async (id) => {
  return await knex("User").where({ id }).first();
};

const createUser = async (userData) => {
  const errors = validateUserData(userData);

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  try {
    const [insertedId] = await knex("User").insert({
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      gender: userData.gender,
      email: userData.email,
      city: userData.city,
      state_province: userData.state_province,
      zip_code: userData.zip_code,
      country: userData.country,
      phone_number: userData.phone_number,
      date_of_birth: userData.date_of_birth,
      profile_picture_url: userData.profile_picture_url,
      password: userData.password,
      auth_provider: userData.auth_provider,
      google_id: userData.google_id,
      elo: userData.elo,
      rank: userData.rank,
      status: userData.status,
    });

    return await knex("User").where({ id: insertedId }).first();
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Email or username already exists.");
    }
    throw error;
  }
};

const updateUser = async (id, userData) => {
  const rowsAffected = await knex("User").where({ id }).update({
    first_name: userData.first_name,
    last_name: userData.last_name,
    username: userData.username,
    gender: userData.gender,
    email: userData.email,
    city: userData.city,
    state_province: userData.state_province,
    zip_code: userData.zip_code,
    country: userData.country,
    phone_number: userData.phone_number,
    date_of_birth: userData.date_of_birth,
    profile_picture_url: userData.profile_picture_url,
    password: userData.password,
    auth_provider: userData.auth_provider,
    google_id: userData.google_id,
    elo: userData.elo,
    rank: userData.rank,
    status: userData.status,
  });

  if (rowsAffected) {
    return getUserById(id);
  }
  return null;
};

const deleteUser = async (id) => {
  const rowsDeleted = await knex("User").where({ id }).del();
  return rowsDeleted > 0;
};

// Fetch tournaments a user is registered for
const getUserTournaments = async (user_id) => {
  // console.log("Fetching tournaments for user_id:", user_id);
  const tournaments = await knex("TournamentUser")
    .join("Tournament", "TournamentUser.tournament_id", "Tournament.id")
    .where("TournamentUser.user_id", user_id)
    .select("Tournament.*");
  // console.log("Query result:", tournaments);
  return tournaments;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTournaments,
};
