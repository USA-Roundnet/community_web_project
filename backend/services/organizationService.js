const knex = require('../knex.js'); 

const getAllOrganizations = async () => {
  return await knex('Organization').select('*');
};

const getOrganizationById = async (id) => {
  return await knex('Organization').where({ id }).first();
};

const createOrganization = async (orgData) => {
  const [insertedId] = await knex('Organization').insert({
    name: orgData.name,
    city: orgData.city,
    state_province: orgData.state_province,
    zip_code: orgData.zip_code,
    country: orgData.country,
    email: orgData.email,
    website: orgData.website,
    phone_number: orgData.phone_number,
  });
  return getOrganizationById(insertedId);
};

const updateOrganization = async (id, orgData) => {
  const rowsAffected = await knex('Organization').where({ id }).update({
    name: orgData.name,
    city: orgData.city,
    state_province: orgData.state_province,
    zip_code: orgData.zip_code,
    country: orgData.country,
    email: orgData.email,
    website: orgData.website,
    phone_number: orgData.phone_number,
  });
  if (rowsAffected) {
    return getOrganizationById(id);
  }
  return null;
};

const deleteOrganization = async (id) => {
  const rowsDeleted = await knex('Organization').where({ id }).del();
  return rowsDeleted > 0;
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
