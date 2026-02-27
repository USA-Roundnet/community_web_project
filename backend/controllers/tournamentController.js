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
  const payload = { ...req.body, director_id: directorId };
  const newTournament = await tournamentService.createTournament(payload);
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

const getTournamentTeams = asyncHandler(async (req, res) => {
  const teams = await tournamentService.getTournamentTeams(req.params.id);
  res.status(200).json(teams);
});

const getTournamentDivisions = asyncHandler(async (req, res) => {
  const divisions = await tournamentService.getTournamentDivisions(req.params.id);
  res.status(200).json(divisions);
});

const createTournamentDivision = asyncHandler(async (req, res) => {
  const createdDivision = await tournamentService.createTournamentDivision(
    req.params.id,
    req.user.id,
    req.body
  );

  const statusCode = Number.isInteger(createdDivision?.status)
    ? createdDivision.status
    : 201;
  if (statusCode >= 400) {
    const err = new Error(
      createdDivision.message || "Failed to create tournament division"
    );
    err.statusCode = statusCode;
    throw err;
  }

  res.status(statusCode).json(createdDivision);
});

const getTournamentRegistrations = asyncHandler(async (req, res) => {
  const { division_id, payment_status } = req.query;
  const registrations = await tournamentService.getTournamentRegistrations(
    req.params.id,
    { division_id, payment_status }
  );
  res.status(200).json(registrations);
});

const updateTournamentRegistration = asyncHandler(async (req, res) => {
  const updatedRegistration = await tournamentService.updateTournamentRegistration(
    req.params.id,
    req.params.registrationId,
    req.body
  );

  const statusCode = Number.isInteger(updatedRegistration?.status)
    ? updatedRegistration.status
    : 200;
  if (statusCode >= 400) {
    const err = new Error(
      updatedRegistration.message || "Failed to update registration"
    );
    err.statusCode = statusCode;
    throw err;
  }

  res.status(statusCode).json(updatedRegistration);
});

const getTournamentDetails = asyncHandler(async (req, res) => {
  const details = await tournamentService.getTournamentDetails(req.params.id);
  if (!details) {
    throw new NotFoundError("Tournament not found");
  }
  res.status(200).json(details);
});

const registerForTournament = asyncHandler(async (req, res) => {
  const { team_id, tournament_division_id } = req.body;
  if (!team_id || !tournament_division_id) {
    throw new BadRequestError("team_id and tournament_division_id are required");
  }

  const registration = await tournamentService.registerForTournament(
    req.params.id,
    req.user.id,
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
    req.params.id,
    req.user.id,
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

const getTournamentMatchCandidates = asyncHandler(async (req, res) => {
  const candidates = await tournamentService.getTournamentMatchCandidates(
    req.params.id
  );
  res.status(200).json(candidates);
});

const getTournamentMatches = asyncHandler(async (req, res) => {
  const matches = await tournamentService.getTournamentMatches(req.params.id, {
    date: req.query.date,
  });
  res.status(200).json(matches);
});

const createTournamentMatch = asyncHandler(async (req, res) => {
  const match = await tournamentService.createTournamentMatch(
    req.params.id,
    req.body
  );
  res.status(201).json(match);
});

const getMyMatchAlerts = asyncHandler(async (req, res) => {
  const alerts = await tournamentService.getMyMatchAlerts(req.user.id, req.params.id);
  res.status(200).json(alerts);
});

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentTeams,
  getTournamentDivisions,
  createTournamentDivision,
  getTournamentRegistrations,
  updateTournamentRegistration,
  getTournamentDetails,
  registerForTournament,
  unregisterFromTournament,
  getTournamentMatchCandidates,
  getTournamentMatches,
  createTournamentMatch,
  getMyMatchAlerts,
};
