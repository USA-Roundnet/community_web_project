const userOrganizationService = require("../services/userOrganizationService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError } = require("../utils/customErrors");

const getAllUserOrganizations = asyncHandler(async (req, res) => {
  const userOrganizations = await userOrganizationService.getAllUserOrganizations();
  res.status(200).json(userOrganizations);
});

const getUserOrganizationById = asyncHandler(async (req, res) => {
  const userOrganization = await userOrganizationService.getUserOrganizationById(req.params.id);
  if (!userOrganization) throw new NotFoundError("UserOrganization record not found");
  res.status(200).json(userOrganization);
});

const createUserOrganization = asyncHandler(async (req, res) => {
  const newUserOrganization = await userOrganizationService.createUserOrganization(req.body);
  res.status(201).json(newUserOrganization);
});

const updateUserOrganization = asyncHandler(async (req, res) => {
  const updatedUserOrganization = await userOrganizationService.updateUserOrganization(req.params.id, req.body);
  if (!updatedUserOrganization) throw new NotFoundError("UserOrganization record not found");
  res.status(200).json(updatedUserOrganization);
});

const deleteUserOrganization = asyncHandler(async (req, res) => {
  const deleted = await userOrganizationService.deleteUserOrganization(req.params.id);
  if (!deleted) throw new NotFoundError("UserOrganization record not found");
  res.status(200).json({ message: "UserOrganization record deleted successfully" });
});

module.exports = {
  getAllUserOrganizations,
  getUserOrganizationById,
  createUserOrganization,
  updateUserOrganization,
  deleteUserOrganization,
};
