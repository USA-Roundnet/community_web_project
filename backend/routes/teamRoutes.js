const express = require("express");
const teamController = require("../controllers/teamController");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateTeamInput } = require("../middleware/teamMiddleware");
const { verify } = require('jsonwebtoken');


//Create a team
router.post(
    "/",
    verifyToken,
    validateTeamInput,
    asyncHandler(teamController.createTeam)
);

//get all teams
router.get("/", verifyToken, teamController.getAllTeams);

//get a team by id
router.get("/:id", verifyToken, teamController.getTeamById);

//Edit a team by id
router.put(
    "/:id",
    verifyToken,
    validateTeamInput,
    asyncHandler(teamController.updateTeam)
);

//Delete a team by id
router.delete("/:id", verifyToken, teamController.deleteTeam);

module.exports = router;
