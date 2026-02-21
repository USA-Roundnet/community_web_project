const db = require("../knex-config");
const asyncHandler = require("./asyncHandler");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/customErrors");
const {
  normalizeTextFields,
  findUnsafeTournamentText,
} = require("../utils/contentSafety");

const allowedStatuses = new Set(["upcoming", "in_progress", "completed"]);
const allowedFormats = new Set(["asl", "college", "classic"]);
const requiredCreateFields = [
  "name",
  "city",
  "state_province",
  "zip_code",
  "country",
  "format",
  "start_date",
  "end_date",
  "max_teams",
];

const isBlank = (value) =>
  value === undefined || value === null || `${value}`.trim() === "";

const normalizeTournamentPayload = (payload = {}) => {
  const normalizedPayload = normalizeTextFields(payload);

  return {
    ...normalizedPayload,
    state_province:
      normalizedPayload.state_province ?? normalizedPayload.state,
    zip_code: normalizedPayload.zip_code ?? normalizedPayload.zipCode,
    start_date: normalizedPayload.start_date ?? normalizedPayload.startDate,
    end_date: normalizedPayload.end_date ?? normalizedPayload.endDate,
    max_teams: normalizedPayload.max_teams ?? normalizedPayload.maxTeams,
    status: normalizedPayload.status ?? "upcoming",
    timezone: normalizedPayload.timezone ?? "UTC",
  };
};

// Middleware to validate tournament creation or update input
const validateTournamentInput = (req, res, next) => {
  req.body = normalizeTournamentPayload(req.body);
  const isCreate = req.method === "POST";

  if (isCreate) {
    const missingFields = requiredCreateFields.filter((field) =>
      isBlank(req.body[field])
    );
    if (missingFields.length > 0) {
      return next(
        new BadRequestError(
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }
  }

  if (req.body.format && !allowedFormats.has(req.body.format)) {
    return next(new BadRequestError("Invalid format"));
  }

  if (req.body.status && !allowedStatuses.has(req.body.status)) {
    return next(new BadRequestError("Invalid status"));
  }

  const unsafeTextResult = findUnsafeTournamentText(req.body);
  if (unsafeTextResult) {
    if (unsafeTextResult.reason === "profanity") {
      return next(
        new BadRequestError(
          `The ${unsafeTextResult.field} field contains disallowed profanity`
        )
      );
    }

    return next(
      new BadRequestError(
        `The ${unsafeTextResult.field} field contains suspicious input`
      )
    );
  }

  const startDateSource = req.body.start_date ?? req.tournament?.start_date;
  const endDateSource = req.body.end_date ?? req.tournament?.end_date;

  if (startDateSource && endDateSource) {
    const startDate = new Date(startDateSource);
    const endDate = new Date(endDateSource);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return next(new BadRequestError("Invalid start_date or end_date"));
    }

    if (isCreate) {
      const startDateOnly = startDate.toISOString().slice(0, 10);
      const todayOnly = new Date().toISOString().slice(0, 10);
      if (startDateOnly < todayOnly) {
        return next(
          new BadRequestError("start_date must be today or a future date")
        );
      }
    }

    if (endDate < startDate) {
      return next(
        new BadRequestError("end_date must be on or after start_date")
      );
    }
  }

  const maxTeamsSource = req.body.max_teams ?? req.tournament?.max_teams;
  if (!isBlank(maxTeamsSource)) {
    const maxTeamsNumber = Number(maxTeamsSource);
    if (!Number.isInteger(maxTeamsNumber) || maxTeamsNumber <= 0) {
      return next(new BadRequestError("max_teams must be a positive integer"));
    }
    req.body.max_teams = maxTeamsNumber;
  }

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
