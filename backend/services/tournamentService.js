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
    director_id: tournamentData.director_id,
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
    director_id: tournamentData.director_id,
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
  const teams = await knex("Team")
    .join("Registration", "Team.id", "Registration.team_id")
    .join(
      "TournamentDivision",
      "Registration.tournament_division_id",
      "TournamentDivision.id"
    )
    .where("TournamentDivision.tournament_id", tournament_id)
    .select("Team.*");

  if (!teams || teams.length === 0) {
    throw new Error("No teams found for the specified tournament");
  }

  // console.log("Fetched teams for tournament:", tournament_id, teams);
  return teams;
};

// Register a user (and their team) for a specific division in a tournament
const registerForTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  // console.log("Registering team:", {tournament_id, user_id, team_id, tournament_division_id,});

  // Validate that the tournament exists
  const tournament = await knex("Tournament")
    .where({ id: tournament_id })
    .first();
  // console.log("Tournament found:", tournament);
  if (!tournament) {
    throw new Error("Tournament not found");
  }

  // Validate that the tournament division exists
  const tournamentDivision = await knex("TournamentDivision")
    .where({ id: tournament_division_id, tournament_id })
    .first();
  // console.log("Tournament division found:", tournamentDivision);
  if (!tournamentDivision) {
    throw new Error("Tournament division not found");
  }

  // Check if the team is already registered
  const existingRegistration = await knex("Registration")
    .where({ team_id, tournament_division_id })
    .first();
  // console.log("Existing registration:", existingRegistration);
  if (existingRegistration) {
    throw new Error("Team is already registered for this tournament division");
  }

  // Insert the registration
  const [registrationId] = await knex("Registration").insert({
    team_id,
    tournament_division_id,
    status: "registered",
    payment_status: "unpaid",
    created_at: new Date(),
  });

  // Link the user to the tournament in the TournamentUser table
  await knex("TournamentUser").insert({
    user_id,
    tournament_division_id,
    created_at: new Date(),
  });
  console.log("Inserted into TournamentUser:", {
    user_id,
    tournament_division_id,
  });

  // console.log("Registration created with ID:", registrationId);
  return { id: registrationId };
};

// Fetch tournaments a user is registered for
const getUserTournaments = async (user_id) => {
  console.log("Fetching tournaments for user_id:", user_id);
  const tournaments = await knex("TournamentUser")
    .join(
      "TournamentDivision",
      "TournamentUser.tournament_division_id",
      "TournamentDivision.id"
    )
    .join("Tournament", "TournamentDivision.tournament_id", "Tournament.id")
    .where("TournamentUser.user_id", user_id)
    .select("Tournament.*");
  console.log("Tournaments fetched:", tournaments);
  return tournaments;
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
