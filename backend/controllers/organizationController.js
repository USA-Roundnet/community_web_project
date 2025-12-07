const organizationService = require("../services/organizationService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, ValidationError } = require("../utils/customErrors");

const getAllOrganizations = asyncHandler(async (req, res) => {
  const organizations = await organizationService.getAllOrganizations();
  res.status(200).json(organizations);
});

const getOrganizationById = asyncHandler(async (req, res) => {
  const organization = await organizationService.getOrganizationById(
    req.params.id
  );
  if (!organization) throw new NotFoundError("Organization not found");
  res.status(200).json(organization);
});

const createOrganization = asyncHandler(async (req, res) => {
  const { name, location } = req.body;
  if (!name || !location) throw new ValidationError("Validation failed");

  const newOrganization = await organizationService.createOrganization(
    req.body
  );
  res.status(201).json(newOrganization);
});

const updateOrganization = asyncHandler(async (req, res) => {
  const updatedOrganization = await organizationService.updateOrganization(
    req.params.id,
    req.body
  );
  if (!updatedOrganization) throw new NotFoundError("Organization not found");
  res.status(200).json(updatedOrganization);
});

const deleteOrganization = asyncHandler(async (req, res) => {
  const deleted = await organizationService.deleteOrganization(req.params.id);
  if (!deleted) throw new NotFoundError("Organization not found");
  res.status(200).json({ message: "Organization deleted successfully" });
});

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
