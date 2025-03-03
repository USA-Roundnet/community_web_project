const knex = require('../knex.js'); 

const getAllTournaments = async () => {
  return await knex('Tournament').select('*');
};

const getTournamentById = async (id) => {
  return await knex('Tournament').where({ id }).first();
};

const createTournament = async (tournamentData) => {
  const [insertedId] = await knex('Tournament').insert({
    name: tournamentData.name,
    city: tournamentData.city,
    state_province: tournamentData.state_province,
    zip_code: tournamentData.zip_code,
    country: tournamentData.country,
    timezone: tournamentData.timezone,
    status: tournamentData.status,
    format: tournamentData.format,
    phone_number: tournamentData.phone_number,
    email: tournamentData.email,
    start_date: tournamentData.start_date,
    end_date: tournamentData.end_date,
    max_teams: tournamentData.max_teams,
    registration_deadline: tournamentData.registration_deadline,
  });
  return getTournamentById(insertedId);
};

const updateTournament = async (id, tournamentData) => {
  const rowsAffected = await knex('Tournament')
    .where({ id })
    .update({
      name: tournamentData.name,
      city: tournamentData.city,
      state_province: tournamentData.state_province,
      zip_code: tournamentData.zip_code,
      country: tournamentData.country,
      timezone: tournamentData.timezone,
      status: tournamentData.status,
      format: tournamentData.format,
      phone_number: tournamentData.phone_number,
      email: tournamentData.email,
      start_date: tournamentData.start_date,
      end_date: tournamentData.end_date,
      max_teams: tournamentData.max_teams,
      registration_deadline: tournamentData.registration_deadline,
    });
  if (rowsAffected) {
    return getTournamentById(id);
  }
  return null;
};

const deleteTournament = async (id) => {
  const rowsDeleted = await knex('Tournament').where({ id }).del();
  return rowsDeleted > 0;
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
