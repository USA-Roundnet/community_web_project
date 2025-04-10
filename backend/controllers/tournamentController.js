const tournamentService = require("../services/tournamentService");

const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json(tournaments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tournaments", details: error.message });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    if (tournament) {
      res.status(200).json(tournament);
    } else {
      res.status(404).json({ message: "Tournament not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tournament", details: error.message });
  }
};

const createTournament = async (req, res) => {
  try {
    const newTournament = await tournamentService.createTournament(req.body);
    res.status(201).json(newTournament);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create tournament", details: error.message });
  }
};

const updateTournament = async (req, res) => {
  try {
    const updatedTournament = await tournamentService.updateTournament(
      req.params.id,
      req.body
    );
    if (updatedTournament) {
      res.status(200).json(updatedTournament);
    } else {
      res.status(404).json({ message: "Tournament not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update tournament", details: error.message });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const deleted = await tournamentService.deleteTournament(req.params.id);
    if (deleted) {
      res.status(200).json({ message: "Tournament deleted successfully" });
    } else {
      res.status(404).json({ message: "Tournament not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete tournament", details: error.message });
  }
};

// Fetch all teams registered for a specific tournament
const getTournamentTeams = async (req, res) => {
  try {
    // Call the service to fetch the teams
    const teams = await tournamentService.getTournamentTeams(req.params.id);

    res.status(200).json({
      success: true,
      data: teams,
      message: "Teams fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
      details: error.message,
    });
  }
};

// Register a user (and their team) for a specific division in a tournament
const registerForTournament = async (req, res) => {
  try {
    const { team_id, tournament_division_id } = req.body;

    // Call the service to handle the registration logic
    const registration = await tournamentService.registerForTournament(
      req.params.id, // tournament_id
      req.user.id, // user_id
      team_id,
      tournament_division_id
    );

    res.status(201).json({
      success: true,
      data: registration,
      message: "Registration successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register for tournament",
      details: error.message,
    });
  }
};

// Fetch tournaments a user is registered for
const getUserTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getUserTournaments(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: tournaments,
      message: "Tournaments fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user tournaments",
      details: error.message,
    });
  }
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
