const tournamentService = require('../services/tournamentService');

const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await tournamentService.getAllTournaments();
    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tournaments', details: error.message });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await tournamentService.getTournamentById(req.params.id);
    if (tournament) {
      res.status(200).json(tournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tournament', details: error.message });
  }
};

const createTournament = async (req, res) => {
  try {
    const newTournament = await tournamentService.createTournament(req.body);
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create tournament', details: error.message });
  }
};

const updateTournament = async (req, res) => {
  try {
    const updatedTournament = await tournamentService.updateTournament(req.params.id, req.body);
    if (updatedTournament) {
      res.status(200).json(updatedTournament);
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update tournament', details: error.message });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const deleted = await tournamentService.deleteTournament(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Tournament deleted successfully' });
    } else {
      res.status(404).json({ message: 'Tournament not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete tournament', details: error.message });
  }
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
