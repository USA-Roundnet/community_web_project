const tournamentService = require("../services/tournamentService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, BadRequestError } = require("../utils/customErrors");

const getAllTournaments = asyncHandler(async (req, res) => {
  const tournaments = await tournamentService.getAllTournaments();
  res.status(200).json(tournaments);
});

const getTournamentById = asyncHandler(async (req, res) => {
  const tournament = await tournamentService.getTournamentById(req.params.id);
  if (!tournament) throw new NotFoundError("Tournament not found");
  res.status(200).json(tournament);
});

const createTournament = asyncHandler(async (req, res) => {
  const directorId = req.user?.id;
  const newTournament = await tournamentService.createTournament({
    ...req.body,
    director_id: directorId,
  });
  res.status(201).json(newTournament);
});

const updateTournament = asyncHandler(async (req, res) => {
  const updatedTournament = await tournamentService.updateTournament(
    req.params.id,
    req.body
  );
  if (!updatedTournament) throw new NotFoundError("Tournament not found");
  res.status(200).json(updatedTournament);
});

const deleteTournament = asyncHandler(async (req, res) => {
  const deleted = await tournamentService.deleteTournament(req.params.id);
  if (!deleted) throw new NotFoundError("Tournament not found");
  res.status(200).json({ message: "Tournament deleted successfully" });
});

// Fetch all teams registered for a specific tournament
const getTournamentTeams = asyncHandler(async (req, res) => {
  const teams = await tournamentService.getTournamentTeams(req.params.id);
  res.status(200).json(teams);
});

// Register a user (and their team) for a specific division in a tournament
const registerForTournament = asyncHandler(async (req, res) => {
  const { team_id, tournament_division_id } = req.body;
  if (!team_id || !tournament_division_id) {
    throw new BadRequestError("team_id and tournament_division_id are required");
  }

  const registration = await tournamentService.registerForTournament(
    req.params.id, // tournament_id
    req.user.id, // user_id
    team_id,
    tournament_division_id
  );

  const status = registration.status || 201;
  if (status >= 400) {
    const err = new Error(registration.message || "Failed to register for tournament");
    err.statusCode = status;
    throw err;
  }

  res.status(status).json(registration);
});

const unregisterFromTournament = asyncHandler(async (req, res) => {
  const { team_id, tournament_division_id } = req.body;
  if (!team_id || !tournament_division_id) {
    throw new BadRequestError("team_id and tournament_division_id are required");
  }

  const result = await tournamentService.unregisterFromTournament(
    req.params.id, // tournament_id
    req.user.id, // user_id
    team_id,
    tournament_division_id
  );

  const status = result.status || 200;
  if (status >= 400) {
    const err = new Error(result.message || "Failed to unregister from tournament");
    err.statusCode = status;
    throw err;
  }

  res.status(status).json({ message: result.message });
});

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentTeams,
  registerForTournament,
  unregisterFromTournament,
};
