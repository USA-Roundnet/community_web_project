const knex = require("../knex-config.js");
const { validateDuplicateRegistration } = require("../utils/validation");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");
const tournamentDivisionService = require("./tournamentDivisionService");
const {
  applySeedSnapshotValuesIfSupported,
  buildTournamentWritePayload,
  deriveTournamentStatus,
  getSeedSnapshotSelects,
  getTournamentScoreRules,
  hasSeriesSeedSnapshotColumns,
  parseScheduledDateTime,
  toIsoDateOnly,
  toSqlDateTime,
  validateDateAndTimeFormat,
} = require("./tournamentServiceUtils");

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
  return tournamentDivisionService.getTournamentDivisions(tournament_id);
};

const createTournamentDivision = async (
  tournament_id,
  creator_id,
  divisionData
) => {
  return tournamentDivisionService.createTournamentDivision(
    tournament_id,
    creator_id,
    divisionData
  );
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
      "r.group_id",
      "r.seed",
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
    .first(
      "r.id",
      "r.status",
      "r.payment_status",
      "r.seed",
      "r.group_id",
      "r.tournament_division_id"
    );

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

  if (updates.seed !== undefined) {
    if (updates.seed === null || updates.seed === "") {
      patch.seed = null;
    } else {
      const seedNumber = Number(updates.seed);
      if (!Number.isInteger(seedNumber) || seedNumber <= 0) {
        return { status: 400, message: "seed must be a positive integer" };
      }

      const duplicateSeed = await knex("Registration")
        .where({
          tournament_division_id: currentRegistration.tournament_division_id,
          seed: seedNumber,
        })
        .whereNot({ id: registration_id })
        .first("id");

      if (duplicateSeed) {
        return {
          status: 409,
          message: "seed must be unique within this tournament division",
        };
      }
      patch.seed = seedNumber;
    }
  }

  if (updates.group_id !== undefined) {
    if (updates.group_id === null || updates.group_id === "") {
      patch.group_id = null;
    } else {
      const groupNumber = Number(updates.group_id);
      if (!Number.isInteger(groupNumber) || groupNumber <= 0) {
        return { status: 400, message: "group_id must be a positive integer" };
      }
      patch.group_id = groupNumber;
    }
  }

  if (Object.keys(patch).length === 0) {
    return {
      status: 400,
      message:
        "At least one of status, payment_status, seed, or group_id is required",
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
      "r.group_id",
      "r.seed",
      "r.status",
      "r.payment_status",
      "r.created_at",
      "team.name as team_name",
      "d.name as division_name",
      "d.id as division_id"
    );

  return updatedRegistration;
};

const reorderTournamentRegistrations = async (
  tournament_id,
  updates = []
) => {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new BadRequestError("updates must be a non-empty array");
  }

  const seenRegistrationIds = new Set();
  const normalizedUpdates = updates.map((update) => {
    const registrationId = Number(update.registration_id);
    const tournamentDivisionId = Number(update.tournament_division_id);
    const seed = Number(update.seed);
    const groupId =
      update.group_id === undefined || update.group_id === null || update.group_id === ""
        ? null
        : Number(update.group_id);

    if (!Number.isInteger(registrationId) || registrationId <= 0) {
      throw new BadRequestError("registration_id must be a positive integer");
    }
    if (seenRegistrationIds.has(registrationId)) {
      throw new BadRequestError(
        `Duplicate registration_id supplied (${registrationId})`
      );
    }
    seenRegistrationIds.add(registrationId);

    if (!Number.isInteger(tournamentDivisionId) || tournamentDivisionId <= 0) {
      throw new BadRequestError(
        "tournament_division_id must be a positive integer"
      );
    }
    if (!Number.isInteger(seed) || seed <= 0) {
      throw new BadRequestError("seed must be a positive integer");
    }
    if (groupId !== null && (!Number.isInteger(groupId) || groupId <= 0)) {
      throw new BadRequestError(
        "group_id must be null or a positive integer"
      );
    }

    return {
      registration_id: registrationId,
      tournament_division_id: tournamentDivisionId,
      seed,
      group_id: groupId,
    };
  });

  const registrationIds = normalizedUpdates.map((update) => update.registration_id);
  const currentRegistrations = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .whereIn("r.id", registrationIds)
    .andWhere("td.tournament_id", tournament_id)
    .select(
      "r.id",
      "r.team_id",
      "r.tournament_division_id",
      "r.seed",
      "r.group_id",
      "r.status"
    );

  if (currentRegistrations.length !== normalizedUpdates.length) {
    throw new NotFoundError(
      "One or more registrations were not found for this tournament"
    );
  }

  const targetDivisionIds = [
    ...new Set(normalizedUpdates.map((update) => update.tournament_division_id)),
  ];
  const validTargetDivisions = await knex("TournamentDivision")
    .whereIn("id", targetDivisionIds)
    .andWhere("tournament_id", tournament_id)
    .select("id");
  if (validTargetDivisions.length !== targetDivisionIds.length) {
    throw new BadRequestError(
      "One or more target tournament_division_id values are invalid for this tournament"
    );
  }

  const currentByRegistrationId = new Map(
    currentRegistrations.map((registration) => [registration.id, registration])
  );
  const updatesByRegistrationId = new Map(
    normalizedUpdates.map((update) => [update.registration_id, update])
  );

  const affectedDivisionIds = [
    ...new Set([
      ...currentRegistrations.map((registration) => registration.tournament_division_id),
      ...targetDivisionIds,
    ]),
  ];

  const affectedDivisionRegistrations = await knex("Registration as r")
    .whereIn("r.tournament_division_id", affectedDivisionIds)
    .select("r.id", "r.team_id", "r.tournament_division_id", "r.seed", "r.group_id");

  const finalStateByRegistrationId = new Map(
    affectedDivisionRegistrations.map((registration) => [
      registration.id,
      {
        registration_id: registration.id,
        team_id: registration.team_id,
        tournament_division_id: registration.tournament_division_id,
        seed: registration.seed,
        group_id: registration.group_id,
      },
    ])
  );

  normalizedUpdates.forEach((update) => {
    const current = currentByRegistrationId.get(update.registration_id);
    const final = finalStateByRegistrationId.get(update.registration_id);
    if (!current || !final) {
      return;
    }
    final.tournament_division_id = update.tournament_division_id;
    final.seed = update.seed;
    final.group_id = update.group_id;
  });

  const teamDivisionKeys = new Set();
  for (const registration of finalStateByRegistrationId.values()) {
    const key = `${registration.tournament_division_id}-${registration.team_id}`;
    if (teamDivisionKeys.has(key)) {
      throw new BadRequestError(
        "A team cannot have multiple registrations in the same division"
      );
    }
    teamDivisionKeys.add(key);
  }

  const seedsByDivision = new Map();
  for (const registration of finalStateByRegistrationId.values()) {
    const divisionId = Number(registration.tournament_division_id);
    const seedValue = Number(registration.seed);
    if (!Number.isInteger(seedValue) || seedValue <= 0) {
      throw new BadRequestError("seed must be a positive integer");
    }

    if (!seedsByDivision.has(divisionId)) {
      seedsByDivision.set(divisionId, new Set());
    }

    const seenSeeds = seedsByDivision.get(divisionId);
    if (seenSeeds.has(seedValue)) {
      throw new BadRequestError(
        `Duplicate seed detected in division ${divisionId}: ${seedValue}`
      );
    }
    seenSeeds.add(seedValue);
  }

  await knex.transaction(async (trx) => {
    for (const update of normalizedUpdates) {
      await trx("Registration")
        .where({ id: update.registration_id })
        .update({
          tournament_division_id: update.tournament_division_id,
          seed: update.seed,
          group_id: update.group_id,
        });
    }
  });

  return getTournamentRegistrations(tournament_id);
};

const registerForTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
  const tournament = await knex("Tournament").where({ id: tournament_id }).first();
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
};

const unregisterFromTournament = async (
  tournament_id,
  user_id,
  team_id,
  tournament_division_id
) => {
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
};

const getTournamentMatchCandidates = async (
  tournament_id,
  { division_id } = {}
) => {
  const query = knex("Registration as r")
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
      "r.seed",
      "r.group_id",
      "division.name as division_name"
    )
    .orderByRaw("r.seed IS NULL ASC")
    .orderBy("r.seed", "asc")
    .orderBy("team.name", "asc");

  if (division_id) {
    query.andWhere("r.tournament_division_id", Number(division_id));
  }

  return query;
};

const getDivisionPools = async (tournament_id, division_id) => {
  return tournamentDivisionService.getDivisionPools(tournament_id, division_id);
};

const generateDivisionPoolsSnake = async (
  tournament_id,
  division_id,
  { pool_count }
) => {
  return tournamentDivisionService.generateDivisionPoolsSnake(
    tournament_id,
    division_id,
    { pool_count }
  );
};

const getTournamentMatches = async (tournament_id, filters = {}) => {
  const seedSnapshotSelects = await getSeedSnapshotSelects();

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
      ...seedSnapshotSelects,
      "s.winner_id",
      "s.wins_needed",
      "s.location",
      "s.created_at as scheduled_at",
      "r1.tournament_division_id as division_id",
      "r1.seed as registration1_seed",
      "r2.seed as registration2_seed",
      "r1.group_id as registration1_group_id",
      "r2.group_id as registration2_group_id",
      "t1.id as team1_id",
      "t1.name as team1_name",
      "t2.id as team2_id",
      "t2.name as team2_name"
    )
    .orderBy("s.created_at", "asc");

  if (filters.date) {
    query.whereRaw("DATE(s.created_at) = ?", [filters.date]);
  }

  if (filters.division_id) {
    const divisionIdNumber = Number(filters.division_id);
    if (Number.isInteger(divisionIdNumber)) {
      query
        .andWhere("r1.tournament_division_id", divisionIdNumber)
        .andWhere("r2.tournament_division_id", divisionIdNumber);
    }
  }

  return query;
};

const getTournamentMatchById = async (tournament_id, matchId) => {
  const matches = await getTournamentMatches(tournament_id);
  return matches.find((match) => match.id === matchId) || null;
};

const ensureMatchRegistrationsBelongToTournament = async (
  tournament_id,
  registration1Id,
  registration2Id
) => {
  const registrations = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .whereIn("r.id", [registration1Id, registration2Id])
    .where("td.tournament_id", tournament_id)
    .where("r.status", "registered")
    .select(
      "r.id",
      "r.team_id",
      "r.tournament_division_id",
      "r.seed",
      "r.group_id"
    );

  if (registrations.length !== 2) {
    throw new NotFoundError(
      "One or both registrations are not active for this tournament"
    );
  }

  const [registrationOne, registrationTwo] = registrations;
  if (registrationOne.team_id === registrationTwo.team_id) {
    throw new BadRequestError("A team cannot be scheduled to play itself");
  }

  if (
    registrationOne.tournament_division_id !==
    registrationTwo.tournament_division_id
  ) {
    throw new BadRequestError(
      "Matches must be scheduled between teams in the same division"
    );
  }

  return {
    registrationOne,
    registrationTwo,
  };
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

  validateDateAndTimeFormat(scheduled_date, scheduled_time);
  parseScheduledDateTime(scheduled_date, scheduled_time);

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

  const { registrationOne, registrationTwo } =
    await ensureMatchRegistrationsBelongToTournament(
    tournament_id,
    registration1IdNumber,
    registration2IdNumber
    );

  const insertPayload = {
    tournament_id,
    registration1_id: registration1IdNumber,
    registration2_id: registration2IdNumber,
    wins_needed: winsNeeded,
    location,
    created_at: scheduledAtSql,
  };
  await applySeedSnapshotValuesIfSupported(
    insertPayload,
    registrationOne,
    registrationTwo
  );

  const [seriesId] = await knex("Series").insert(insertPayload);

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

const buildPoolRoundRobinMatches = (poolTeams) => {
  const sortedTeams = [...poolTeams].sort(
    (a, b) => Number(a.seed) - Number(b.seed)
  );

  if (sortedTeams.length < 2) {
    return [];
  }

  const workingTeams = [...sortedTeams];
  if (workingTeams.length % 2 === 1) {
    workingTeams.push(null);
  }

  const roundCount = workingTeams.length - 1;
  const matches = [];

  for (let roundIndex = 0; roundIndex < roundCount; roundIndex += 1) {
    for (let i = 0; i < workingTeams.length / 2; i += 1) {
      const highSeedTeam = workingTeams[i];
      const lowSeedTeam = workingTeams[workingTeams.length - 1 - i];
      if (!highSeedTeam || !lowSeedTeam) {
        continue;
      }

      matches.push({
        round: roundIndex + 1,
        order_in_round: i + 1,
        registration1_id: highSeedTeam.registration_id,
        registration2_id: lowSeedTeam.registration_id,
        seed1: Number(highSeedTeam.seed),
        seed2: Number(lowSeedTeam.seed),
      });
    }

    const fixed = workingTeams[0];
    const rotated = [
      fixed,
      workingTeams[workingTeams.length - 1],
      ...workingTeams.slice(1, workingTeams.length - 1),
    ];
    workingTeams.splice(0, workingTeams.length, ...rotated);
  }

  return matches;
};

const autoGenerateDivisionPoolMatches = async (
  tournament_id,
  division_id,
  options = {}
) => {
  const poolData = await getDivisionPools(tournament_id, division_id);
  if (!poolData.pools.length) {
    throw new BadRequestError(
      "No pools found for this division. Generate or assign pools before creating matches."
    );
  }

  const tournament = await getTournamentById(tournament_id);
  if (!tournament) {
    throw new NotFoundError("Tournament not found");
  }

  const scheduledDate =
    options.scheduled_date ||
    toIsoDateOnly(tournament.start_date) ||
    toIsoDateOnly(new Date());
  const scheduledTime = options.scheduled_time || "09:00";
  const locationPrefix = `${options.location_prefix || "Pool Play"}`.trim();
  const minutesBetweenMatches =
    options.minutes_between_matches === undefined
      ? 30
      : Number(options.minutes_between_matches);
  const winsNeeded =
    options.wins_needed === undefined ? 1 : Number(options.wins_needed);

  validateDateAndTimeFormat(scheduledDate, scheduledTime);
  if (!Number.isInteger(minutesBetweenMatches) || minutesBetweenMatches <= 0) {
    throw new BadRequestError(
      "minutes_between_matches must be a positive integer"
    );
  }
  if (!Number.isInteger(winsNeeded) || winsNeeded <= 0) {
    throw new BadRequestError("wins_needed must be a positive integer");
  }

  const startDateTime = parseScheduledDateTime(
    scheduledDate,
    scheduledTime,
    "Invalid scheduled_date/scheduled_time"
  );

  const existingDivisionMatches = await knex("Series as s")
    .join("Registration as r1", "s.registration1_id", "r1.id")
    .join("Registration as r2", "s.registration2_id", "r2.id")
    .where("s.tournament_id", tournament_id)
    .andWhere("r1.tournament_division_id", division_id)
    .andWhere("r2.tournament_division_id", division_id)
    .select("s.registration1_id", "s.registration2_id");

  const existingKeys = new Set(
    existingDivisionMatches.map((match) =>
      [match.registration1_id, match.registration2_id].sort((a, b) => a - b).join("-")
    )
  );

  const candidateMatches = [];
  poolData.pools.forEach((pool) => {
    const poolMatches = buildPoolRoundRobinMatches(pool.teams);
    poolMatches.forEach((match) => {
      candidateMatches.push({
        ...match,
        pool_number: pool.pool_number,
      });
    });
  });

  const createdMatchIds = [];
  const createdMatchesSummary = [];
  let skippedCount = 0;
  let createdOffset = 0;
  const seedSnapshotColumnsSupported = await hasSeriesSeedSnapshotColumns();

  for (const candidate of candidateMatches) {
    const key = [candidate.registration1_id, candidate.registration2_id]
      .sort((a, b) => a - b)
      .join("-");

    if (existingKeys.has(key)) {
      skippedCount += 1;
      continue;
    }

    const scheduledAt = new Date(startDateTime.getTime());
    scheduledAt.setMinutes(
      startDateTime.getMinutes() + createdOffset * minutesBetweenMatches
    );

    const insertPayload = {
      tournament_id,
      registration1_id: candidate.registration1_id,
      registration2_id: candidate.registration2_id,
      wins_needed: winsNeeded,
      location: `${locationPrefix} - Pool ${candidate.pool_number}`,
      created_at: toSqlDateTime(scheduledAt),
    };

    if (seedSnapshotColumnsSupported) {
      insertPayload.registration1_seed_snapshot = candidate.seed1;
      insertPayload.registration2_seed_snapshot = candidate.seed2;
    }

    const [seriesId] = await knex("Series").insert(insertPayload);

    createdMatchIds.push(seriesId);
    createdMatchesSummary.push({
      id: seriesId,
      pool_number: candidate.pool_number,
      round: candidate.round,
      order_in_round: candidate.order_in_round,
      registration1_id: candidate.registration1_id,
      registration2_id: candidate.registration2_id,
      seed1: candidate.seed1,
      seed2: candidate.seed2,
    });
    existingKeys.add(key);
    createdOffset += 1;
  }

  const matches = await Promise.all(
    createdMatchIds.map((matchId) => getTournamentMatchById(tournament_id, matchId))
  );

  return {
    tournament_id: Number(tournament_id),
    tournament_division_id: Number(division_id),
    candidate_count: candidateMatches.length,
    created_count: createdMatchesSummary.length,
    skipped_count: skippedCount,
    created_matches: createdMatchesSummary,
    matches: matches.filter(Boolean),
  };
};

const updateTournamentMatch = async (tournament_id, match_id, updates = {}) => {
  const currentMatch = await getTournamentMatchById(tournament_id, Number(match_id));
  if (!currentMatch) {
    throw new NotFoundError("Match not found");
  }

  const patch = {};
  const registration1Id =
    updates.registration1_id === undefined
      ? currentMatch.registration1_id
      : Number(updates.registration1_id);
  const registration2Id =
    updates.registration2_id === undefined
      ? currentMatch.registration2_id
      : Number(updates.registration2_id);

  if (
    updates.registration1_id !== undefined ||
    updates.registration2_id !== undefined
  ) {
    if (!Number.isInteger(registration1Id) || !Number.isInteger(registration2Id)) {
      throw new BadRequestError("registration ids must be integers");
    }
    if (registration1Id === registration2Id) {
      throw new BadRequestError(
        "registration1_id and registration2_id must be different teams"
      );
    }
    const { registrationOne, registrationTwo } =
      await ensureMatchRegistrationsBelongToTournament(
      tournament_id,
      registration1Id,
      registration2Id
    );
    patch.registration1_id = registration1Id;
    patch.registration2_id = registration2Id;
    await applySeedSnapshotValuesIfSupported(
      patch,
      registrationOne,
      registrationTwo
    );
  }

  if (updates.wins_needed !== undefined) {
    const winsNeeded = Number(updates.wins_needed);
    if (!Number.isInteger(winsNeeded) || winsNeeded <= 0) {
      throw new BadRequestError("wins_needed must be a positive integer");
    }
    patch.wins_needed = winsNeeded;
  }

  if (updates.location !== undefined) {
    const trimmedLocation = `${updates.location}`.trim();
    if (!trimmedLocation) {
      throw new BadRequestError("location is required");
    }
    patch.location = trimmedLocation;
  }

  if (
    updates.scheduled_date !== undefined ||
    updates.scheduled_time !== undefined
  ) {
    if (!updates.scheduled_date || !updates.scheduled_time) {
      throw new BadRequestError(
        "scheduled_date and scheduled_time are both required when editing schedule"
      );
    }
    validateDateAndTimeFormat(updates.scheduled_date, updates.scheduled_time);
    patch.created_at = `${updates.scheduled_date} ${updates.scheduled_time}:00`;
  }

  if (Object.keys(patch).length === 0) {
    throw new BadRequestError("No valid match fields supplied for update");
  }

  await knex("Series")
    .where({ id: match_id, tournament_id })
    .update(patch);

  const updatedMatch = await getTournamentMatchById(tournament_id, Number(match_id));
  if (!updatedMatch) {
    throw new NotFoundError("Updated match not found");
  }

  return updatedMatch;
};

const validateCompletedGameScore = (
  team1Score,
  team2Score,
  { target_score, overtime_cap, win_by }
) => {
  const parsedTeam1 = Number(team1Score);
  const parsedTeam2 = Number(team2Score);

  if (
    !Number.isInteger(parsedTeam1) ||
    !Number.isInteger(parsedTeam2) ||
    parsedTeam1 < 0 ||
    parsedTeam2 < 0
  ) {
    throw new BadRequestError("Game scores must be non-negative integers");
  }

  if (parsedTeam1 === parsedTeam2) {
    throw new BadRequestError("Game scores cannot be tied");
  }

  const winningScore = Math.max(parsedTeam1, parsedTeam2);
  const losingScore = Math.min(parsedTeam1, parsedTeam2);
  const margin = winningScore - losingScore;

  if (winningScore > overtime_cap) {
    throw new BadRequestError(
      `Winning score cannot exceed overtime cap (${overtime_cap})`
    );
  }

  if (winningScore < target_score) {
    throw new BadRequestError(
      `Winning score must reach at least ${target_score}`
    );
  }

  if (winningScore < overtime_cap && margin < win_by) {
    throw new BadRequestError(
      `Winning score must be by at least ${win_by} before the cap`
    );
  }

  return {
    team1_score: parsedTeam1,
    team2_score: parsedTeam2,
    winner_side: parsedTeam1 > parsedTeam2 ? 1 : 2,
  };
};

const saveTournamentMatchResults = async (
  tournament_id,
  match_id,
  payload = {}
) => {
  const match = await getTournamentMatchById(tournament_id, Number(match_id));
  if (!match) {
    throw new NotFoundError("Match not found");
  }

  if (!Array.isArray(payload.games) || payload.games.length === 0) {
    throw new BadRequestError("games must be a non-empty array");
  }

  const tournament = await getTournamentById(tournament_id);
  if (!tournament) {
    throw new NotFoundError("Tournament not found");
  }
  const scoreRules = getTournamentScoreRules(tournament);

  const normalizedGames = payload.games.map((game, index) => {
    const gameNumber = Number(game.game_number || index + 1);
    if (!Number.isInteger(gameNumber) || gameNumber <= 0) {
      throw new BadRequestError("game_number must be a positive integer");
    }

    const validatedScore = validateCompletedGameScore(
      game.team1_score,
      game.team2_score,
      scoreRules
    );

    return {
      game_number: gameNumber,
      ...validatedScore,
    };
  });

  const duplicateGameNumber = normalizedGames.find(
    (game, index) =>
      normalizedGames.findIndex((entry) => entry.game_number === game.game_number) !==
      index
  );
  if (duplicateGameNumber) {
    throw new BadRequestError(
      `Duplicate game_number supplied (${duplicateGameNumber.game_number})`
    );
  }

  normalizedGames.sort((left, right) => left.game_number - right.game_number);

  let team1Wins = 0;
  let team2Wins = 0;
  normalizedGames.forEach((game) => {
    if (game.winner_side === 1) {
      team1Wins += 1;
    } else {
      team2Wins += 1;
    }
  });

  const winsNeeded = Number(match.wins_needed || 1);
  if (team1Wins < winsNeeded && team2Wins < winsNeeded) {
    throw new BadRequestError(
      `One team must reach ${winsNeeded} game win${winsNeeded === 1 ? "" : "s"}`
    );
  }

  const winnerRegistrationId =
    team1Wins >= winsNeeded ? match.registration1_id : match.registration2_id;

  await knex.transaction(async (trx) => {
    await trx("Game").where({ series_id: match.id }).del();

    if (normalizedGames.length) {
      await trx("Game").insert(
        normalizedGames.map((game) => ({
          series_id: match.id,
          game_number: game.game_number,
          team1_score: game.team1_score,
          team2_score: game.team2_score,
          status: "completed",
        }))
      );
    }

    await trx("Series")
      .where({ id: match.id, tournament_id })
      .update({ winner_id: winnerRegistrationId });
  });

  const updatedMatch = await getTournamentMatchById(tournament_id, Number(match_id));
  const savedGames = await knex("Game")
    .where({ series_id: Number(match_id) })
    .orderBy("game_number", "asc")
    .select("id", "series_id", "game_number", "team1_score", "team2_score", "status");

  return {
    ...updatedMatch,
    games: savedGames,
    result_summary: {
      team1_name: updatedMatch?.team1_name,
      team2_name: updatedMatch?.team2_name,
      team1_wins: team1Wins,
      team2_wins: team2Wins,
      winner_registration_id: winnerRegistrationId,
      winner_team_name:
        winnerRegistrationId === updatedMatch?.registration1_id
          ? updatedMatch?.team1_name
          : updatedMatch?.team2_name,
      rules: scoreRules,
    },
  };
};

const getTournamentOutcomeStats = async (tournament_id) => {
  const tournament = await getTournamentById(tournament_id);
  if (!tournament) {
    throw new NotFoundError("Tournament not found");
  }

  const scoreRules = getTournamentScoreRules(tournament);
  const registrations = await knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .join("Team as team", "r.team_id", "team.id")
    .leftJoin("Division as d", "td.division_id", "d.id")
    .where("td.tournament_id", tournament_id)
    .select(
      "r.id as registration_id",
      "r.team_id",
      "team.name as team_name",
      "r.seed",
      "r.tournament_division_id",
      "d.name as division_name"
    );

  const seedSnapshotSelects = await getSeedSnapshotSelects();

  const matches = await knex("Series as s")
    .join("Registration as r1", "s.registration1_id", "r1.id")
    .join("Registration as r2", "s.registration2_id", "r2.id")
    .join("Team as t1", "r1.team_id", "t1.id")
    .join("Team as t2", "r2.team_id", "t2.id")
    .where("s.tournament_id", tournament_id)
    .whereNotNull("s.winner_id")
    .select(
      "s.id",
      "s.registration1_id",
      "s.registration2_id",
      "s.winner_id",
      ...seedSnapshotSelects,
      "s.created_at as scheduled_at",
      "t1.name as team1_name",
      "t2.name as team2_name"
    );

  const teamStatsMap = new Map();
  registrations.forEach((registration) => {
    teamStatsMap.set(registration.registration_id, {
      registration_id: registration.registration_id,
      team_id: registration.team_id,
      team_name: registration.team_name,
      division_id: registration.tournament_division_id,
      division_name: registration.division_name,
      seed: registration.seed,
      wins: 0,
      losses: 0,
      wins_against: [],
      losses_against: [],
    });
  });

  matches.forEach((match) => {
    const registrationOneStats = teamStatsMap.get(match.registration1_id);
    const registrationTwoStats = teamStatsMap.get(match.registration2_id);
    if (!registrationOneStats || !registrationTwoStats) {
      return;
    }

    const registrationOneSeed =
      match.registration1_seed_snapshot || registrationOneStats.seed;
    const registrationTwoSeed =
      match.registration2_seed_snapshot || registrationTwoStats.seed;

    if (Number(match.winner_id) === Number(match.registration1_id)) {
      registrationOneStats.wins += 1;
      registrationTwoStats.losses += 1;
      registrationOneStats.wins_against.push({
        match_id: match.id,
        opponent_registration_id: match.registration2_id,
        opponent_team_name: registrationTwoStats.team_name,
        opponent_seed: registrationTwoSeed,
        own_seed: registrationOneSeed,
        scheduled_at: match.scheduled_at,
      });
      registrationTwoStats.losses_against.push({
        match_id: match.id,
        opponent_registration_id: match.registration1_id,
        opponent_team_name: registrationOneStats.team_name,
        opponent_seed: registrationOneSeed,
        own_seed: registrationTwoSeed,
        scheduled_at: match.scheduled_at,
      });
    } else {
      registrationTwoStats.wins += 1;
      registrationOneStats.losses += 1;
      registrationTwoStats.wins_against.push({
        match_id: match.id,
        opponent_registration_id: match.registration1_id,
        opponent_team_name: registrationOneStats.team_name,
        opponent_seed: registrationOneSeed,
        own_seed: registrationTwoSeed,
        scheduled_at: match.scheduled_at,
      });
      registrationOneStats.losses_against.push({
        match_id: match.id,
        opponent_registration_id: match.registration2_id,
        opponent_team_name: registrationTwoStats.team_name,
        opponent_seed: registrationTwoSeed,
        own_seed: registrationOneSeed,
        scheduled_at: match.scheduled_at,
      });
    }
  });

  const teamIdToRegistrationStats = new Map();
  for (const teamStats of teamStatsMap.values()) {
    teamIdToRegistrationStats.set(teamStats.team_id, teamStats);
  }

  const memberships = await knex("UserTeam as ut")
    .join("User as user", "ut.user_id", "user.id")
    .whereIn("ut.team_id", [...teamIdToRegistrationStats.keys()])
    .andWhere("ut.status", "accepted")
    .select(
      "ut.user_id",
      "ut.team_id",
      "ut.role",
      "user.username",
      "user.first_name",
      "user.last_name"
    );

  const playerStatsMap = new Map();
  memberships.forEach((membership) => {
    const teamStats = teamIdToRegistrationStats.get(membership.team_id);
    if (!teamStats) {
      return;
    }

    const key = `${membership.user_id}-${membership.team_id}`;
    playerStatsMap.set(key, {
      user_id: membership.user_id,
      username: membership.username,
      first_name: membership.first_name,
      last_name: membership.last_name,
      team_id: membership.team_id,
      team_name: teamStats.team_name,
      role: membership.role,
      wins: teamStats.wins,
      losses: teamStats.losses,
      wins_against: teamStats.wins_against,
      losses_against: teamStats.losses_against,
    });
  });

  return {
    tournament_id: Number(tournament_id),
    rules: scoreRules,
    team_stats: [...teamStatsMap.values()].sort((a, b) =>
      `${a.team_name}`.localeCompare(`${b.team_name}`)
    ),
    player_stats: [...playerStatsMap.values()].sort((a, b) =>
      `${a.username || ""}`.localeCompare(`${b.username || ""}`)
    ),
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
  reorderTournamentRegistrations,
  getTournamentDetails,
  registerForTournament,
  unregisterFromTournament,
  getTournamentMatchCandidates,
  getDivisionPools,
  generateDivisionPoolsSnake,
  getTournamentMatches,
  createTournamentMatch,
  autoGenerateDivisionPoolMatches,
  updateTournamentMatch,
  saveTournamentMatchResults,
  getTournamentOutcomeStats,
  getMyMatchAlerts,
};
