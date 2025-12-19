const teamService = require("../services/teamService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../utils/customErrors");

const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await teamService.getAllTeams();
  res.status(200).json(teams);
});

const getTeamById = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  if (!team) throw new NotFoundError("Team not found");
  res.status(200).json(team);
});

const createTeam = asyncHandler(async (req, res) => {
  console.log("Team creation requested with:", req.body);
  const newTeam = await teamService.createTeam(req.body);
  res.status(201).json(newTeam);
});

const updateTeam = asyncHandler(async (req, res) => {
  const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
  if (!updatedTeam) throw new NotFoundError("Team not found");
  res.status(200).json(updatedTeam);
});

const deleteTeam = asyncHandler(async (req, res) => {
  const deleted = await teamService.deleteTeam(req.params.id);
  if (!deleted) throw new NotFoundError("Team not found");
  res.status(200).json({ message: "Team deleted successfully" });
});

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};
