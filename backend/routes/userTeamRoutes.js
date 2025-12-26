const express = require('express');
const userTeamController = require('../controllers/userTeamController');
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateUserTeamInput } = require("../middleware/userTeamMiddleware");
const { verify } = require('jsonwebtoken');

// Get all userTeams
router.get('/', userTeamController.getAllUserTeams);

// Get userTeam by ID
router.get('/:id', userTeamController.getUserTeamById);

// Create userTeam
router.post(
    '/',
    verifyToken,
    validateUserTeamInput,
    asyncHandler(userTeamController.createUserTeam)
);

//Edit userTeam
router.put(
    '/:id',
    verifyToken,
    validateUserTeamInput, 
    asyncHandler(userTeamController.updateUserTeam)
);

// Delete userTeam
router.delete('/:id', userTeamController.deleteUserTeam);

module.exports = router;
