const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const tournamentController = require("../controllers/tournamentController");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateTournamentInput,
  checkTournamentExists,
  checkTournamentDirector,
} = require("../middleware/tournamentMiddleware");

// Fetch all tournaments
router.get("/", asyncHandler(tournamentController.getAllTournaments));

// Fetch details of a specific tournament
router.get(
  "/:id",
  checkTournamentExists,
  asyncHandler(tournamentController.getTournamentById)
);

// Fetch all teams registered for a specific tournament
router.get(
  "/:id/teams",
  verifyToken,
  checkTournamentExists,
  asyncHandler(tournamentController.getTournamentTeams)
);

// Create a new tournament
router.post(
  "/",
  verifyToken,
  validateTournamentInput,
  asyncHandler(tournamentController.createTournament)
);

// Update a tournament
router.put(
  "/:id",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  validateTournamentInput,
  asyncHandler(tournamentController.updateTournament)
);

// Delete a tournament
router.delete(
  "/:id",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.deleteTournament)
);

// Register a user (and their team) for a specific division in a tournament
router.post(
  "/:id/register",
  verifyToken,
  checkTournamentExists,
  asyncHandler(tournamentController.registerForTournament)
);

router.delete(
  "/:id/unregister",
  verifyToken,
  asyncHandler(tournamentController.unregisterFromTournament)
);

// Fetch tournaments a user is registered for
const { getUserTournaments } = require("../services/tournamentService");

router.get("/api/users/:id/tournaments", async (req, res) => {
  try {
    const userId = req.params.id;
    const tournaments = await getUserTournaments(userId);
    if (!tournaments || tournaments.length === 0) {
      return res
        .status(404)
        .json({ message: "No tournaments found for this user" });
    }
    res.status(200).json(tournaments);
  } catch (error) {
    console.error("Error fetching user tournaments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
