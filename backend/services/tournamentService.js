const knex = require("../knex-config.js");
const { validateDuplicateRegistration } = require("../utils/validation");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");

const toIsoDateOnly = (dateValue) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10);
};

const deriveTournamentStatus = (startDateValue, endDateValue) => {
  const todayDateOnly = toIsoDateOnly(new Date());
  const startDateOnly = toIsoDateOnly(startDateValue);
  const endDateOnly = toIsoDateOnly(endDateValue);

  if (!todayDateOnly || !startDateOnly || !endDateOnly) {
    return "upcoming";
  }

  if (todayDateOnly < startDateOnly) {
    return "upcoming";
  }

  if (todayDateOnly > endDateOnly) {
    return "completed";
  }

  return "in_progress";
};

const buildTournamentWritePayload = (tournamentData) => ({
  name: tournamentData.name,
  city: tournamentData.city,
  state_province: tournamentData.state_province,
  zip_code: tournamentData.zip_code,
  country: tournamentData.country,
  timezone: tournamentData.timezone,
  status: deriveTournamentStatus(tournamentData.start_date, tournamentData.end_date),
  format: tournamentData.format,
  phone_number: tournamentData.phone_number,
  email: tournamentData.email,
  start_date: tournamentData.start_date,
  end_date: tournamentData.end_date,
  max_teams: tournamentData.max_teams,
  registration_deadline: tournamentData.registration_deadline,
  director_id: tournamentData.director_id,
});

const syncTournamentStatus = async (tournament) => {
  if (!tournament) {
    return tournament;
  }

  const calculatedStatus = deriveTournamentStatus(
    tournament.start_date,
    tournament.end_date
  );

  if (tournament.status === calculatedStatus) {
    return tournament;
  }

  await knex("Tournament")
    .where({ id: tournament.id })
    .update({ status: calculatedStatus });

  return {
    ...tournament,
    status: calculatedStatus,
  };
};

const getAllTournaments = async () => {
  const tournaments = await knex("Tournament").select("*");
  return Promise.all(tournaments.map(syncTournamentStatus));
};

const getTournamentById = async (id) => {
  const tournament = await knex("Tournament").where({ id }).first();
  return syncTournamentStatus(tournament);
};

const createTournament = async (tournamentData) => {
  const [insertedId] = await knex("Tournament").insert(
    buildTournamentWritePayload(tournamentData)
  );
  return getTournamentById(insertedId);
};

const updateTournament = async (id, tournamentData) => {
  const existingTournament = await knex("Tournament").where({ id }).first();
  if (!existingTournament) {
    return null;
  }

  const mergedTournamentData = {
    ...existingTournament,
    ...tournamentData,
    director_id: existingTournament.director_id,
  };

  const rowsAffected = await knex("Tournament")
    .where({ id })
    .update(buildTournamentWritePayload(mergedTournamentData));

  if (rowsAffected) {
    return getTournamentById(id);
  }
  return null;
};

const deleteTournament = async (id) => {
  const rowsDeleted = await knex("Tournament").where({ id }).del();
  return rowsDeleted > 0;
};

const getTournamentTeams = async (tournament_id) => {
  const teams = await knex("Team")
    .join("Registration", "Team.id", "Registration.team_id")
    .join(
      "TournamentDivision",
      "Registration.tournament_division_id",
      "TournamentDivision.id"
    )
    .where("TournamentDivision.tournament_id", tournament_id)
    .select("Team.*");

  if (!teams || teams.length === 0) {
    throw new Error("No teams found for the specified tournament");
  }

  return teams;
};

const getTournamentDivisions = async (tournament_id) => {
  return knex("TournamentDivision as td")
    .join("Division as d", "td.division_id", "d.id")
    .leftJoin("Registration as r", "r.tournament_division_id", "td.id")
    .where("td.tournament_id", tournament_id)
    .groupBy(
      "td.id",
      "td.tournament_id",
      "td.division_id",
      "td.max_teams",
      "td.registration_fee",
      "td.created_at",
      "d.name"
    )
    .orderBy("td.created_at", "asc")
    .select(
      "td.id",
      "td.tournament_id",
      "td.division_id",
      "td.max_teams",
      "td.registration_fee",
      "td.created_at",
      "d.name as division_name"
    )
    .count({ registered_teams: "r.id" });
};

const createTournamentDivision = async (
  tournament_id,
  creator_id,
  divisionData
) => {
  const normalizedName = `${divisionData.name || ""}`.trim();
  if (!normalizedName) {
    return { status: 400, message: "Division name is required" };
  }

  const maxTeams = Number(divisionData.max_teams);
  if (!Number.isInteger(maxTeams) || maxTeams <= 0) {
    return { status: 400, message: "max_teams must be a positive integer" };
  }

  const existingDivision = await knex("TournamentDivision as td")
    .join("Division as d", "td.division_id", "d.id")
    .where("td.tournament_id", tournament_id)
    .andWhereRaw("LOWER(d.name) = ?", [normalizedName.toLowerCase()])
    .first("td.id");

  if (existingDivision) {
    return { status: 409, message: "Division already exists for this tournament" };
  }

  const [divisionId] = await knex("Division").insert({
    creator_id,
    name: normalizedName,
  });

  const registrationFee = divisionData.registration_fee;
  const [tournamentDivisionId] = await knex("TournamentDivision").insert({
    division_id: divisionId,
    tournament_id,
    max_teams: maxTeams,
    registration_fee:
      registrationFee === undefined || registrationFee === null
        ? null
        : Number(registrationFee),
  });

  const [createdDivision] = await knex("TournamentDivision as td")
    .join("Division as d", "td.division_id", "d.id")
    .where("td.id", tournamentDivisionId)
    .select(
      "td.id",
      "td.tournament_id",
      "td.division_id",
      "td.max_teams",
      "td.registration_fee",
      "td.created_at",
      "d.name as division_name"
    );

  return createdDivision;
};

const getTournamentRegistrations = async (
  tournament_id,
  { division_id, payment_status } = {}
) => {
  const query = knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .join("Division as d", "td.division_id", "d.id")
    .join("Team as team", "r.team_id", "team.id")
    .where("td.tournament_id", tournament_id)
    .orderBy("r.created_at", "desc")
    .select(
      "r.id",
      "r.team_id",
      "r.tournament_division_id",
      "r.status",
      "r.payment_status",
      "r.created_at",
      "team.name as team_name",
      "d.name as division_name",
      "d.id as division_id"
    );

  if (division_id) {
    query.andWhere("td.id", division_id);
  }

  if (payment_status) {
    query.andWhere("r.payment_status", payment_status);
  }

  return query;
};

const updateTournamentRegistration = async (
  tournament_id,
  registration_id,
  updates = {}
) => {
  const currentRegistration = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .where("r.id", registration_id)
    .andWhere("td.tournament_id", tournament_id)
    .first("r.id", "r.status", "r.payment_status");

  if (!currentRegistration) {
    return { status: 404, message: "Registration not found" };
  }

  const patch = {};
  if (updates.status !== undefined) {
    const allowedStatuses = new Set(["registered", "withdrawn"]);
    if (!allowedStatuses.has(updates.status)) {
      return { status: 400, message: "Invalid registration status" };
    }
    patch.status = updates.status;
  }

  if (updates.payment_status !== undefined) {
    const allowedPaymentStatuses = new Set(["paid", "pending", "unpaid"]);
    if (!allowedPaymentStatuses.has(updates.payment_status)) {
      return { status: 400, message: "Invalid payment_status" };
    }
    patch.payment_status = updates.payment_status;
  }

  if (Object.keys(patch).length === 0) {
    return {
      status: 400,
      message: "At least one of status or payment_status is required",
    };
  }

  await knex("Registration").where({ id: registration_id }).update(patch);

  const [updatedRegistration] = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .join("Division as d", "td.division_id", "d.id")
    .join("Team as team", "r.team_id", "team.id")
    .where("r.id", registration_id)
    .andWhere("td.tournament_id", tournament_id)
    .select(
      "r.id",
      "r.team_id",
      "r.tournament_division_id",
      "r.status",
      "r.payment_status",
      "r.created_at",
      "team.name as team_name",
      "d.name as division_name",
      "d.id as division_id"
    );

  return updatedRegistration;
};

const registerForTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  try {
    const tournament = await knex("Tournament")
      .where({ id: tournament_id })
      .first();
    if (!tournament) {
      return { status: 404, message: "Tournament not found" };
    }

    const tournamentDivision = await knex("TournamentDivision")
      .where({ id: tournament_division_id, tournament_id })
      .first();
    if (!tournamentDivision) {
      return { status: 404, message: "Tournament division not found" };
    }

    try {
      await validateDuplicateRegistration(team_id, tournament_division_id);
    } catch (error) {
      return error;
    }

    const [registrationId] = await knex("Registration").insert({
      team_id,
      tournament_division_id,
      status: "registered",
      payment_status: "unpaid",
      created_at: new Date(),
    });

    const existingTournamentUser = await knex("TournamentUser")
      .where({ user_id, tournament_id })
      .first();
    if (!existingTournamentUser) {
      await knex("TournamentUser").insert({
        user_id,
        tournament_id,
        created_at: new Date(),
      });
    }

    return { id: registrationId };
  } catch (error) {
    throw error;
  }
};

const unregisterFromTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  try {
    const registration = await knex("Registration")
      .where({ team_id, tournament_division_id })
      .first();
    if (!registration) {
      return { status: 404, message: "Registration not found" };
    }

    await knex("Registration").where({ team_id, tournament_division_id }).del();

    const remainingRegistrations = await knex("Registration")
      .join(
        "TournamentDivision",
        "Registration.tournament_division_id",
        "TournamentDivision.id"
      )
      .where("TournamentDivision.tournament_id", tournament_id)
      .andWhere("Registration.team_id", team_id)
      .count("Registration.id as count")
      .first();

    if (remainingRegistrations.count === 0) {
      await knex("TournamentUser").where({ user_id, tournament_id }).del();
    }

    return {
      status: 200,
      message: "Successfully unregistered from the tournament",
    };
  } catch (error) {
    throw error;
  }
};

const getTournamentMatchCandidates = async (tournament_id) =>
  knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .join("Team as team", "r.team_id", "team.id")
    .leftJoin("Division as division", "td.division_id", "division.id")
    .where("td.tournament_id", tournament_id)
    .where("r.status", "registered")
    .select(
      "r.id as registration_id",
      "r.team_id",
      "team.name as team_name",
      "r.tournament_division_id",
      "division.name as division_name"
    )
    .orderBy("team.name", "asc");

const getTournamentMatches = async (tournament_id, filters = {}) => {
  const query = knex("Series as s")
    .join("Registration as r1", "s.registration1_id", "r1.id")
    .join("Registration as r2", "s.registration2_id", "r2.id")
    .join("Team as t1", "r1.team_id", "t1.id")
    .join("Team as t2", "r2.team_id", "t2.id")
    .where("s.tournament_id", tournament_id)
    .select(
      "s.id",
      "s.tournament_id",
      "s.registration1_id",
      "s.registration2_id",
      "s.winner_id",
      "s.wins_needed",
      "s.location",
      "s.created_at as scheduled_at",
      "t1.id as team1_id",
      "t1.name as team1_name",
      "t2.id as team2_id",
      "t2.name as team2_name"
    )
    .orderBy("s.created_at", "asc");

  if (filters.date) {
    query.whereRaw("DATE(s.created_at) = ?", [filters.date]);
  }

  return query;
};

const getTournamentMatchById = async (tournament_id, matchId) => {
  const matches = await getTournamentMatches(tournament_id);
  return matches.find((match) => match.id === matchId) || null;
};

const validateMatchScheduleInput = (matchData = {}) => {
  const {
    registration1_id,
    registration2_id,
    scheduled_date,
    scheduled_time,
    location,
  } = matchData;

  if (
    !registration1_id ||
    !registration2_id ||
    !scheduled_date ||
    !scheduled_time ||
    !location
  ) {
    throw new BadRequestError(
      "registration1_id, registration2_id, scheduled_date, scheduled_time, and location are required"
    );
  }

  const registration1IdNumber = Number(registration1_id);
  const registration2IdNumber = Number(registration2_id);
  if (
    !Number.isInteger(registration1IdNumber) ||
    !Number.isInteger(registration2IdNumber)
  ) {
    throw new BadRequestError("registration ids must be integers");
  }

  if (registration1IdNumber === registration2IdNumber) {
    throw new BadRequestError(
      "registration1_id and registration2_id must be different teams"
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(scheduled_date)) {
    throw new BadRequestError("scheduled_date must be in YYYY-MM-DD format");
  }

  if (!/^\d{2}:\d{2}$/.test(scheduled_time)) {
    throw new BadRequestError("scheduled_time must be in HH:mm format");
  }

  const scheduledDateTime = new Date(`${scheduled_date}T${scheduled_time}:00`);
  if (Number.isNaN(scheduledDateTime.getTime())) {
    throw new BadRequestError("Invalid scheduled date/time");
  }

  const winsNeeded =
    matchData.wins_needed === undefined || matchData.wins_needed === null
      ? 1
      : Number(matchData.wins_needed);

  if (!Number.isInteger(winsNeeded) || winsNeeded <= 0) {
    throw new BadRequestError("wins_needed must be a positive integer");
  }

  return {
    registration1IdNumber,
    registration2IdNumber,
    winsNeeded,
    scheduledAtSql: `${scheduled_date} ${scheduled_time}:00`,
    location: `${location}`.trim(),
  };
};

const getTeamMemberUserIds = async (teamIds) => {
  if (!Array.isArray(teamIds) || teamIds.length === 0) {
    return [];
  }

  const rows = await knex("UserTeam")
    .whereIn("team_id", teamIds)
    .andWhere("status", "accepted")
    .distinct("user_id");

  return rows.map((row) => Number(row.user_id)).filter(Boolean);
};

const createTournamentMatch = async (tournament_id, matchData) => {
  const {
    registration1IdNumber,
    registration2IdNumber,
    winsNeeded,
    scheduledAtSql,
    location,
  } = validateMatchScheduleInput(matchData);

  if (!location) {
    throw new BadRequestError("location is required");
  }

  const registrations = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .whereIn("r.id", [registration1IdNumber, registration2IdNumber])
    .where("td.tournament_id", tournament_id)
    .where("r.status", "registered")
    .select("r.id", "r.team_id");

  if (registrations.length !== 2) {
    throw new NotFoundError(
      "One or both registrations are not active for this tournament"
    );
  }

  const [registrationOne, registrationTwo] = registrations;
  if (registrationOne.team_id === registrationTwo.team_id) {
    throw new BadRequestError("A team cannot be scheduled to play itself");
  }

  const [seriesId] = await knex("Series").insert({
    tournament_id,
    registration1_id: registration1IdNumber,
    registration2_id: registration2IdNumber,
    wins_needed: winsNeeded,
    location,
    created_at: scheduledAtSql,
  });

  const createdMatch = await getTournamentMatchById(tournament_id, seriesId);
  if (!createdMatch) {
    throw new NotFoundError("Scheduled match could not be retrieved");
  }

  const recipientUserIds = await getTeamMemberUserIds([
    createdMatch.team1_id,
    createdMatch.team2_id,
  ]);

  return {
    ...createdMatch,
    notifications: {
      mode: "in_app",
      recipient_user_count: recipientUserIds.length,
      recipient_user_ids: recipientUserIds,
    },
  };
};

const getMyMatchAlerts = async (user_id, tournament_id) => {
  const memberships = await knex("UserTeam")
    .where({ user_id, status: "accepted" })
    .distinct("team_id");

  const teamIds = memberships
    .map((membership) => Number(membership.team_id))
    .filter(Boolean);

  if (!teamIds.length) {
    return [];
  }

  const teamIdSet = new Set(teamIds);
  const matches = await getTournamentMatches(tournament_id);

  return matches
    .filter(
      (match) => teamIdSet.has(match.team1_id) || teamIdSet.has(match.team2_id)
    )
    .map((match) => {
      const isTeamOne = teamIdSet.has(match.team1_id);
      return {
        id: match.id,
        tournament_id: match.tournament_id,
        scheduled_at: match.scheduled_at,
        location: match.location,
        wins_needed: match.wins_needed,
        user_team_id: isTeamOne ? match.team1_id : match.team2_id,
        user_team_name: isTeamOne ? match.team1_name : match.team2_name,
        opponent_team_id: isTeamOne ? match.team2_id : match.team1_id,
        opponent_team_name: isTeamOne ? match.team2_name : match.team1_name,
        match_label: `${match.team1_name} vs ${match.team2_name}`,
      };
    });
};

const getTournamentDetails = async (tournament_id) => {
  const tournament = await getTournamentById(tournament_id);
  if (!tournament) {
    return null;
  }

  const [divisions, registrations, matches] = await Promise.all([
    getTournamentDivisions(tournament_id),
    getTournamentRegistrations(tournament_id),
    getTournamentMatches(tournament_id),
  ]);

  const schedule = matches.map((match) => ({
    id: match.id,
    location: match.location,
    wins_needed: match.wins_needed,
    created_at: match.scheduled_at,
    registration1_id: match.registration1_id,
    registration2_id: match.registration2_id,
    winner_id: match.winner_id,
    registration1_team_name: match.team1_name,
    registration2_team_name: match.team2_name,
  }));

  return {
    tournament,
    divisions,
    registrations,
    schedule,
  };
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentTeams,
  getTournamentDivisions,
  createTournamentDivision,
  getTournamentRegistrations,
  updateTournamentRegistration,
  getTournamentDetails,
  registerForTournament,
  unregisterFromTournament,
  getTournamentMatchCandidates,
  getTournamentMatches,
  createTournamentMatch,
  getMyMatchAlerts,
};
