const knex = require("../knex-config.js");

const getAllUsers = async () => {
  return await knex("User").select("*");
};

const getUserById = async (id) => {
  return await knex("User").where({ id }).first();
};

/*
* creats a new user, ensuring gender, statuse, and auth_provider are all valid
* values 
*/
const createUser = async (userData) => { 

  const validGenders = ["male", "female", "other"];
  if (!validGenders.includes(userData.gender))  {
    throw new Error('invalid gender, must me male, female, or other');
  }

  const validStatus = ["bronze", "silver", "gold", "pro"];
  if (userData.status && !validStatus.includes(userData.status))  {
    throw new Error('invalid status, must be bronze, silver, gold, pro');
  }

  const validAuth = ["local", "google"];
  if (userData.auth_provider && !validAuth.includes(userData.auth_provider))  {
    throw new Error('invalid authentication provider, must be local or google');
  }

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

  return getUserById(insertedId);
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
