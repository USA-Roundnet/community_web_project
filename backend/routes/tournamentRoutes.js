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

router.get("/", asyncHandler(tournamentController.getAllTournaments));

router.get(
  "/:id",
  checkTournamentExists,
  asyncHandler(tournamentController.getTournamentById)
);

router.get(
  "/:id/teams",
  verifyToken,
  checkTournamentExists,
  asyncHandler(tournamentController.getTournamentTeams)
);

router.get(
  "/:id/divisions",
  checkTournamentExists,
  asyncHandler(tournamentController.getTournamentDivisions)
);

router.post(
  "/:id/divisions",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.createTournamentDivision)
);

router.get(
  "/:id/registrations",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.getTournamentRegistrations)
);

router.patch(
  "/:id/registrations/:registrationId",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.updateTournamentRegistration)
);

router.get(
  "/:id/details",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.getTournamentDetails)
);

router.post(
  "/",
  verifyToken,
  validateTournamentInput,
  asyncHandler(tournamentController.createTournament)
);

router.put(
  "/:id",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  validateTournamentInput,
  asyncHandler(tournamentController.updateTournament)
);

router.delete(
  "/:id",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.deleteTournament)
);

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

router.get(
  "/:id/matches/candidates",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.getTournamentMatchCandidates)
);

router.get(
  "/:id/matches",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.getTournamentMatches)
);

router.post(
  "/:id/matches",
  verifyToken,
  checkTournamentExists,
  checkTournamentDirector,
  asyncHandler(tournamentController.createTournamentMatch)
);

router.get(
  "/:id/my-match-alerts",
  verifyToken,
  checkTournamentExists,
  asyncHandler(tournamentController.getMyMatchAlerts)
);

module.exports = router;
