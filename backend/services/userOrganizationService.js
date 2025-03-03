const knex = require('../db');

const getAllUserOrganizations = async () => {
  return await knex('UserOrganization').select('*');
};

const getUserOrganizationById = async (id) => {
  return await knex('UserOrganization').where({ id }).first();
};

const createUserOrganization = async (data) => {
  const [insertedId] = await knex('UserOrganization').insert({
    user_id: data.user_id,
    organization_id: data.organization_id,
    role: data.role,
    status: data.status,
  });
  return getUserOrganizationById(insertedId);
};

const updateUserOrganization = async (id, data) => {
  const rowsAffected = await knex('UserOrganization')
    .where({ id })
    .update({
      user_id: data.user_id,
      organization_id: data.organization_id,
      role: data.role,
      status: data.status,
    });
  if (rowsAffected) {
    return getUserOrganizationById(id);
  }
  return null;
};

const deleteUserOrganization = async (id) => {
  const rowsDeleted = await knex('UserOrganization').where({ id }).del();
  return rowsDeleted > 0;
};

module.exports = {
  getAllUserOrganizations,
  getUserOrganizationById,
  createUserOrganization,
  updateUserOrganization,
  deleteUserOrganization,
};
