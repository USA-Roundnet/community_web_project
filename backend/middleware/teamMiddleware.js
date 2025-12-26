const db = require("../knex-config");
const asyncHandler = require("./asyncHandler");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customErrors");

const validateTeamInput = asyncHandler(async (req, res, next) => {
    const { name, team_type_id, pub, description } = req.body;
    if (!name || !team_type_id) {
        return next(new BadRequestError("Name and team type ID are required"));
    }

    if(description && typeof description !== "string") {
        return next(new BadRequestError("Description must be a string"));
    }

    if(!description) {
        return next(new BadRequestError("Description is required"));
    }

    const teamType = await db("teamtype").where({ id: team_type_id }).first();
    if (!teamType) {
        return next(new NotFoundError("Team type not found"));
    }

    next();
});

module.exports = {
    validateTeamInput, 
};