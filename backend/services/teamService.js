const knex = require("../knex-config");

const getAllTeams = async () => {
  return await knex("Team").select("*");
};

const getTeamById = async (id) => {
  return await knex("Team").where({ id }).first();
};

const createTeam = async (teamData) => {
  const [insertedId] = await knex("Team").insert({
    name: teamData.name,
    public: teamData.public,
    size: teamData.size,
    description: teamData.description,
  });
  return getTeamById(insertedId);
};

const updateTeam = async (id, teamData) => {
  const rowsAffected = await knex("Team").where({ id }).update({
    name: teamData.name,
    public: teamData.public,
    size: teamData.size,
    description: teamData.description,
  });
  if (rowsAffected) {
    return getTeamById(id);
  }
  return null;
};

const deleteTeam = async (id) => {
  const rowsDeleted = await knex("Team").where({ id }).del();
  return rowsDeleted > 0;
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};
