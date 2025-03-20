const knex = require("../knex-config.js");

const getAllUsers = async () => {
  return await knex("User").select("*");
};

const getUserById = async (id) => {
  return await knex("User").where({ id }).first();
};

const createUser = async (userData) => {
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
