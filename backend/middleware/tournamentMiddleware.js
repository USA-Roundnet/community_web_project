const db = require("../knex-config");

// Middleware to validate tournament creation or update input
const validateTournamentInput = (req, res, next) => {
  const { name, status, format, start_date, end_date } = req.body;

  if (!name || !status || !format || !start_date || !end_date) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Additional validation logic (e.g., date validation) can go here
  next();
};

// Middleware to check if a tournament exists
const checkTournamentExists = async (req, res, next) => {
  const tournamentId = req.params.id;

  try {
    const tournament = await db("Tournament")
      .where({ id: tournamentId })
      .first();
    if (!tournament) {
      return res
        .status(404)
        .json({ success: false, message: "Tournament not found" });
    }

    // Attach the tournament to the request object for downstream use
    req.tournament = tournament;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check tournament",
      details: error.message,
    });
  }
};

// Middleware to check if the user is a tournament director
const checkTournamentDirector = async (req, res, next) => {
  const userId = req.user.id; // Assuming `req.user` is populated by `verifyToken`
  const tournamentId = req.params.id;

  try {
    const tournament = await db("Tournament")
      .where({ id: tournamentId, director_id: userId })
      .first();
    if (!tournament) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this tournament",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check tournament director",
      details: error.message,
    });
  }
};

module.exports = {
  validateTournamentInput,
  checkTournamentExists,
  checkTournamentDirector,
};
