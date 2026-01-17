const userTeamService = require("../services/userTeamService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../utils/customErrors");

const getAllUserTeams = asyncHandler(async (req, res) => {
  const userTeams = await userTeamService.getAllUserTeams();
  res.status(200).json(userTeams);
});

const getUserTeamById = asyncHandler(async (req, res) => {
  const userTeam = await userTeamService.getUserTeamById(req.params.id);
  if (!userTeam) throw new NotFoundError("UserTeam record not found");
  res.status(200).json(userTeam);
});

const createUserTeam = asyncHandler(async (req, res) => {
  const newUserTeam = await userTeamService.createUserTeam(req.body);
  res.status(201).json(newUserTeam);
});

const updateUserTeam = asyncHandler(async (req, res) => {
  const updatedUserTeam = await userTeamService.updateUserTeam(
    req.params.id,
    req.body
  );
  if (!updatedUserTeam) throw new NotFoundError("UserTeam record not found");
  res.status(200).json(updatedUserTeam);
});

const deleteUserTeam = asyncHandler(async (req, res) => {
  const deleted = await userTeamService.deleteUserTeam(req.params.id);
  if (!deleted) throw new NotFoundError("UserTeam record not found");
  res
    .status(200)
    .json({ message: "UserTeam record deleted successfully" });
});

module.exports = {
  getAllUserTeams,
  getUserTeamById,
  createUserTeam,
  updateUserTeam,
  deleteUserTeam,
};
