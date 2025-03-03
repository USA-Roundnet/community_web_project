const teamService = require('../services/teamService');

const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teams', details: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (team) {
      res.status(200).json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team', details: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const newTeam = await teamService.createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create team', details: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
    if (updatedTeam) {
      res.status(200).json(updatedTeam);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team', details: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const deleted = await teamService.deleteTeam(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Team deleted successfully' });
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team', details: error.message });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};
