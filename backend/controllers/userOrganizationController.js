const userOrganizationService = require('../services/userOrganizationService');

const getAllUserOrganizations = async (req, res) => {
  try {
    const userOrganizations = await userOrganizationService.getAllUserOrganizations();
    res.status(200).json(userOrganizations);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user-organization records', details: error.message });
  }
};

const getUserOrganizationById = async (req, res) => {
  try {
    const userOrganization = await userOrganizationService.getUserOrganizationById(req.params.id);
    if (userOrganization) {
      res.status(200).json(userOrganization);
    } else {
      res.status(404).json({ message: 'UserOrganization record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user-organization record', details: error.message });
  }
};

const createUserOrganization = async (req, res) => {
  try {
    const newUserOrganization = await userOrganizationService.createUserOrganization(req.body);
    res.status(201).json(newUserOrganization);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user-organization record', details: error.message });
  }
};

const updateUserOrganization = async (req, res) => {
  try {
    const updatedUserOrganization = await userOrganizationService.updateUserOrganization(req.params.id, req.body);
    if (updatedUserOrganization) {
      res.status(200).json(updatedUserOrganization);
    } else {
      res.status(404).json({ message: 'UserOrganization record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user-organization record', details: error.message });
  }
};

const deleteUserOrganization = async (req, res) => {
  try {
    const deleted = await userOrganizationService.deleteUserOrganization(req.params.id);
    if (deleted) {
      res.status(200).json({ message: 'UserOrganization record deleted successfully' });
    } else {
      res.status(404).json({ message: 'UserOrganization record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user-organization record', details: error.message });
  }
};

module.exports = {
  getAllUserOrganizations,
  getUserOrganizationById,
  createUserOrganization,
  updateUserOrganization,
  deleteUserOrganization,
};
