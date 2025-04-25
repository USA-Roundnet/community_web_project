const userTeamService = require('../services/userTeamService');

const getAllUserTeams = async (req, res) => {
  try {
    const userTeams = await userTeamService.getAllUserTeams();
    res.status(200).json(userTeams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user-team records', details: error.message });
  }
};

const getUserTeamById = async (req, res) => {
  try {
    const userTeam = await userTeamService.getUserTeamById(req.params.id);
    if (userTeam) {
      res.status(200).json(userTeam);
    } else {
      res.status(404).json({ message: 'UserTeam record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user-team record', details: error.message });
  }
};

const createUserTeam = async (req, res) => {
  try {
    const newUserTeam = await userTeamService.createUserTeam(req.body);
    res.status(201).json(newUserTeam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user-team record', details: error.message });
  }
};

const updateUserTeam = async (req, res) => {
  try {
    const updatedUserTeam = await userTeamService.updateUserTeam(req.params.id, req.body);
    if (updatedUserTeam) {
      res.status(200).json(updatedUserTeam);
    } else {
      res.status(404).json({ message: 'UserTeam record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user-team record', details: error.message });
  }
};

const deleteUserTeam = async (req, res) => {
  try {
    const deleted = await userTeamService.deleteUserTeam(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'UserTeam record deleted successfully' });
    } else {
      res.status(404).json({ message: 'UserTeam record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user-team record', details: error.message });
  }
};

module.exports = {
  getAllUserTeams,
  getUserTeamById,
  createUserTeam,
  updateUserTeam,
  deleteUserTeam,
};
