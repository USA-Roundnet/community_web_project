const db = require("../knex-config");
const asyncHandler = require("./asyncHandler");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customErrors");

const validateUserTeamInput = asyncHandler(async(req, res, next) => {
  const { user_id, team_id, status } = req.body;
    if (!user_id || !team_id || !status) {
        return next(new BadRequestError("Missing required fields"));
    }
    
    const validStatuses = ["invited", "accepted", "declined"];
    if (!validStatuses.includes(status)) {
        return next(new BadRequestError("Invalid status"));
    }

    const user = await db("user").where({ id: user_id }).first();
    const team = await db("team").where({ id: team_id }).first();
    if (!user || !team) {
        return next(new NotFoundError("User or team not found"));
    }

    next();
});

module.exports = {
    validateUserTeamInput,
};