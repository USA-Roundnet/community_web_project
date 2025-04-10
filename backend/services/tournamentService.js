const knex = require("../knex-config.js");

const getAllTournaments = async () => {
  return await knex("Tournament").select("*");
};

const getTournamentById = async (id) => {
  return await knex("Tournament").where({ id }).first();
};

const createTournament = async (tournamentData) => {
  const [insertedId] = await knex("Tournament").insert({
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
  const rowsAffected = await knex("Tournament").where({ id }).update({
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
  const rowsDeleted = await knex("Tournament").where({ id }).del();
  return rowsDeleted > 0;
};

// Fetch all teams registered for a specific tournament
const getTournamentTeams = async (tournament_id) => {
  // Fetch all teams registered for the tournament
  const teams = await db("Team")
    .join("Registration", "Team.id", "Registration.team_id")
    .join(
      "TournamentDivision",
      "Registration.tournament_division_id",
      "TournamentDivision.id"
    )
    .where("TournamentDivision.tournament_id", tournament_id)
    .select("Team.*");

  console.log("Fetched teams for tournament:", tournament_id, teams);
  return teams;
};

const registerForTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  console.log("Registering team:", {
    tournament_id,
    user_id,
    team_id,
    tournament_division_id,
  });

  const existingRegistration = await db("Registration")
    .where({ team_id, tournament_division_id })
    .first();

  if (existingRegistration) {
    throw new Error("Team is already registered for this tournament division");
  }

  const [registrationId] = await db("Registration").insert({
    team_id,
    tournament_division_id,
    status: "registered",
    payment_status: "unpaid",
    created_at: new Date(),
  });

  return { id: registrationId };
};

// Fetch tournaments a user is registered for
const getUserTournaments = async (userId) => {
  return await db("Tournament")
    .join(
      "TournamentRegistration",
      "Tournament.id",
      "TournamentRegistration.tournament_id"
    )
    .join("Team", "TournamentRegistration.team_id", "Team.id")
    .where("Team.created_by", userId)
    .select("Tournament.*");
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentTeams,
  registerForTournament,
  getUserTournaments,
};
