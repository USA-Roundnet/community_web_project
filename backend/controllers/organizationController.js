const organizationService = require('../services/organizationService');

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await organizationService.getAllOrganizations();
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch organizations', details: error.message });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const organization = await organizationService.getOrganizationById(req.params.id);
    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch organization', details: error.message });
  }
};

const createOrganization = async (req, res) => {
  try {
    const newOrganization = await organizationService.createOrganization(req.body);
    res.status(201).json(newOrganization);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create organization', details: error.message });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const updatedOrganization = await organizationService.updateOrganization(req.params.id, req.body);
    if (updatedOrganization) {
      res.status(200).json(updatedOrganization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update organization', details: error.message });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const deleted = await organizationService.deleteOrganization(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'Organization deleted successfully' });
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete organization', details: error.message });
  }
};

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
