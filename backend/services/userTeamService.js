const knex = require('../knex');

const getAllUserTeams = async () => {
  return await knex('UserTeam').select('*');
};

const getUserTeamById = async (id) => {
  return await knex('UserTeam').where({ id }).first();
};

const createUserTeam = async (data) => {
  const [insertedId] = await knex('UserTeam').insert({
    user_id: data.user_id,
    team_id: data.team_id,
    status: data.status,
  });
  return getUserTeamById(insertedId);
};

const updateUserTeam = async (id, data) => {
  const rowsAffected = await knex('UserTeam')
    .where({ id })
    .update({
      user_id: data.user_id,
      team_id: data.team_id,
      status: data.status,
    });
  if (rowsAffected) {
    return getUserTeamById(id);
  }
  return null;
};

const deleteUserTeam = async (id) => {
  const rowsDeleted = await knex('UserTeam').where({ id }).del();
  return rowsDeleted > 0;
};

module.exports = {
  getAllUserTeams,
  getUserTeamById,
  createUserTeam,
  updateUserTeam,
  deleteUserTeam,
};
