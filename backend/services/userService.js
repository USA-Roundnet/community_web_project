const knex = require('../db/knex'); 

const getAllUsers = async () => {
  return await knex('users').select('*');
};

module.exports = {getAllUsers};