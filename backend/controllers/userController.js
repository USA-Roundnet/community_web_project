const userService = require("../services/userService");
const asyncHandler = require("../middleware/asyncHandler");
const { NotFoundError, DuplicateError } = require("../utils/customErrors");

// Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
});

// Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(user);
});

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "Email or username already exists.") {
      throw new DuplicateError(error.message);
    }
    throw error;
  }
});

// Update a user by ID
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  if (!updatedUser) throw new NotFoundError("User not found");
  res.status(200).json(updatedUser);
});

// Delete a user by ID
const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await userService.deleteUser(req.params.id);
  if (!deletedUser) throw new NotFoundError("User not found");
  res.status(200).json({ message: "User deleted successfully" });
});

const getUserTournaments = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const tournaments = await userService.getUserTournaments(userId);

  if (!tournaments || tournaments.length === 0) {
    throw new NotFoundError("No tournaments found for this user");
  }

  res.status(200).json(tournaments);
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserTournaments,
};
