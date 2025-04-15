const knex = require("../knex-config.js");
const { validateDuplicateRegistration } = require("../utils/validation");

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
  try {
    console.log("Registering team:", {
      tournament_id,
      user_id,
      team_id,
      tournament_division_id,
    });

    // Validate that the tournament exists
    const tournament = await knex("Tournament")
      .where({ id: tournament_id })
      .first();
    if (!tournament) {
      console.log("Tournament not found:", tournament_id);
      return { status: 404, message: "Tournament not found" };
    }

    // Validate that the tournament division exists
    const tournamentDivision = await knex("TournamentDivision")
      .where({ id: tournament_division_id, tournament_id })
      .first();
    if (!tournamentDivision) {
      console.log("Tournament division not found:", {
        tournament_division_id,
        tournament_id,
      });
      return { status: 404, message: "Tournament division not found" };
    }

    // Validate duplicate registration
    try {
      await validateDuplicateRegistration(team_id, tournament_division_id);
    } catch (error) {
      console.log("Duplicate registration detected:", error.message);
      return error; // Return the error object to the controller
    }

    // Insert the registration
    const [registrationId] = await knex("Registration").insert({
      team_id,
      tournament_division_id,
      status: "registered",
      payment_status: "unpaid",
      created_at: new Date(),
    });
    console.log("Registration created with ID:", registrationId);

    // Link the user to the tournament in the TournamentUser table
    const existingTournamentUser = await knex("TournamentUser")
      .where({ user_id, tournament_id })
      .first();
    if (!existingTournamentUser) {
      await knex("TournamentUser").insert({
        user_id,
        tournament_id,
        created_at: new Date(),
      });
      console.log("User linked to tournament:", { user_id, tournament_id });
    }

    return { id: registrationId };
  } catch (error) {
    console.log("Error in registerForTournament:", error.message);
    throw error; // Re-throw unexpected errors
  }
};

const unregisterFromTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  try {
    console.log("Unregistering team:", {
      tournament_id,
      user_id,
      team_id,
      tournament_division_id,
    });

    // Validate that the registration exists
    const registration = await knex("Registration")
      .where({ team_id, tournament_division_id })
      .first();
    if (!registration) {
      console.log("Registration not found:", {
        team_id,
        tournament_division_id,
      });
      return { status: 404, message: "Registration not found" };
    }

    // Delete the registration
    await knex("Registration").where({ team_id, tournament_division_id }).del();
    console.log("Registration deleted for team:", {
      team_id,
      tournament_division_id,
    });

    // Check if the user is still associated with the tournament
    const remainingRegistrations = await knex("Registration")
      .join(
        "TournamentDivision",
        "Registration.tournament_division_id",
        "TournamentDivision.id"
      )
      .where("TournamentDivision.tournament_id", tournament_id)
      .andWhere("Registration.team_id", team_id)
      .count("Registration.id as count")
      .first();

    if (remainingRegistrations.count === 0) {
      // Remove the user from the TournamentUser table
      await knex("TournamentUser").where({ user_id, tournament_id }).del();
      console.log("User removed from tournament:", { user_id, tournament_id });
    }

    return {
      status: 200,
      message: "Successfully unregistered from the tournament",
    };
  } catch (error) {
    console.log("Error in unregisterFromTournament:", error.message);
    throw error;
  }
};

// Fetch tournaments a user is registered for
const getUserTournaments = async (user_id) => {
  console.log("Fetching tournaments for user_id:", user_id);
  const tournaments = await knex("TournamentUser")
    .join("Tournament", "TournamentUser.tournament_id", "Tournament.id")
    .where("TournamentUser.user_id", user_id)
    .select("Tournament.*");
  console.log("Query result:", tournaments);
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
  unregisterFromTournament,
  getUserTournaments,
};
