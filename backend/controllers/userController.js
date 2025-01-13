const userService = require('../services/userService');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', details: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', details: error.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', details: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', details: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (deletedUser) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', details: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
