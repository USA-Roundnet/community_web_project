const db = require("../knex-config");
const asyncHandler = require("./asyncHandler");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customErrors");

// Middleware to validate tournament creation or update input
const validateTournamentInput = (req, res, next) => {
  const { name, status, format, start_date, end_date } = req.body;

  if (!name || !status || !format || !start_date || !end_date) {
    return next(new BadRequestError("Missing required fields"));
  }

  // Additional validation logic (e.g., date validation) can go here
  next();
};

// Middleware to check if a tournament exists
const checkTournamentExists = asyncHandler(async (req, res, next) => {
  const tournamentId = req.params.id;

  const tournament = await db("Tournament").where({ id: tournamentId }).first();
  if (!tournament) {
    throw new NotFoundError("Tournament not found");
  }

  // Attach the tournament to the request object for downstream use
  req.tournament = tournament;
  next();
});

// Middleware to check if the user is a tournament director
const checkTournamentDirector = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // Assuming `req.user` is populated by `verifyToken`
  const tournamentId = req.params.id;

  const tournament = await db("Tournament")
    .where({ id: tournamentId, director_id: userId })
    .first();
  if (!tournament) {
    throw new ForbiddenError("You are not authorized to manage this tournament");
  }

  next();
});

module.exports = {
  validateTournamentInput,
  checkTournamentExists,
  checkTournamentDirector,
};
