const knex = require("../knex-config.js");
const { validateDuplicateRegistration } = require("../utils/validation");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");
const { sendEmail } = require("../utils/emailUtils");

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

// Fetch all teams registered for a specific tournament
const getTournamentTeams = async (tournament_id) => {
  // Fetch all teams registered for the tournament
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

  // console.log("Fetched teams for tournament:", tournament_id, teams);
  return teams;
};

// Register a user (and their team) for a specific division in a tournament
const registerForTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  try {
    // Validate that the tournament exists
    const tournament = await knex("Tournament")
      .where({ id: tournament_id })
      .first();
    if (!tournament) {
      // console.log("Tournament not found:", tournament_id);
      return { status: 404, message: "Tournament not found" };
    }

    // Validate that the tournament division exists
    const tournamentDivision = await knex("TournamentDivision")
      .where({ id: tournament_division_id, tournament_id })
      .first();
    if (!tournamentDivision) {
      // console.log("Tournament division not found:", { tournament_division_id, tournament_id,});
      return { status: 404, message: "Tournament division not found" };
    }

    // Validate duplicate registration
    try {
      await validateDuplicateRegistration(team_id, tournament_division_id);
    } catch (error) {
      return error; // Return the error object to the controller
    }

    // Insert the registration
    const [registrationId] = await knex("Registration").insert({
      team_id,
      tournament_division_id,
      status: "registered",
      payment_status: "unpaid",
      created_at: new Date(),
    });
    // Link the user to the tournament in the TournamentUser table
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
    throw error; // Re-throw unexpected errors
  }
};

const unregisterFromTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  try {
    // Validate that the registration exists
    const registration = await knex("Registration")
      .where({ team_id, tournament_division_id })
      .first();
    if (!registration) {
      return { status: 404, message: "Registration not found" };
    }

    // Delete the registration
    await knex("Registration").where({ team_id, tournament_division_id }).del();
    // Check if the user is still associated with the tournament
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
      // Remove the user from the TournamentUser table
      await knex("TournamentUser").where({ user_id, tournament_id }).del();
      // console.log("User removed from tournament:", { user_id, tournament_id });
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

const getTeamNotificationEmails = async (teamIds) => {
  const rows = await knex("UserTeam as ut")
    .join("User as u", "ut.user_id", "u.id")
    .whereIn("ut.team_id", teamIds)
    .where("ut.status", "accepted")
    .whereNotNull("u.email")
    .distinct("u.email");

  return rows.map((row) => row.email).filter(Boolean);
};

const sendMatchScheduleNotifications = async (scheduledMatch) => {
  if (
    process.env.NODE_ENV === "test" ||
    process.env.MATCH_SCHEDULE_EMAILS === "false"
  ) {
    return { attempted: false, delivered: 0, failed: 0, recipients: [] };
  }

  const recipients = await getTeamNotificationEmails([
    scheduledMatch.team1_id,
    scheduledMatch.team2_id,
  ]);

  if (!recipients.length) {
    return { attempted: false, delivered: 0, failed: 0, recipients: [] };
  }

  const scheduledDisplay = new Date(scheduledMatch.scheduled_at).toLocaleString();
  const subject = `Match Scheduled: ${scheduledMatch.team1_name} vs ${scheduledMatch.team2_name}`;
  const html = `
    <p>A new match has been scheduled.</p>
    <p><strong>Teams:</strong> ${scheduledMatch.team1_name} vs ${scheduledMatch.team2_name}</p>
    <p><strong>When:</strong> ${scheduledDisplay}</p>
    <p><strong>Location:</strong> ${scheduledMatch.location}</p>
  `;

  const settled = await Promise.allSettled(
    recipients.map((email) => sendEmail(email, subject, html))
  );

  const delivered = settled.filter((result) => result.status === "fulfilled").length;
  const failed = settled.length - delivered;

  return {
    attempted: true,
    delivered,
    failed,
    recipients,
  };
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

  const notifications = await sendMatchScheduleNotifications(createdMatch);

  return {
    ...createdMatch,
    notifications,
  };
};

module.exports = {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  getTournamentTeams,
  registerForTournament,
  unregisterFromTournament,
  getTournamentMatchCandidates,
  getTournamentMatches,
  createTournamentMatch,
};
