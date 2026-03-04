const knex = require("../knex-config.js");
const { BadRequestError, NotFoundError } = require("../utils/customErrors");

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

const ensureTournamentDivisionExists = async (tournament_id, division_id) => {
  const tournamentDivision = await knex("TournamentDivision")
    .where({
      id: division_id,
      tournament_id,
    })
    .first("id");

  if (!tournamentDivision) {
    throw new NotFoundError("Tournament division not found");
  }
};

const getDivisionRegistrationsForPools = async (tournament_id, division_id) => {
  await ensureTournamentDivisionExists(tournament_id, division_id);

  return knex("Registration as r")
    .join("TournamentDivision as td", "r.tournament_division_id", "td.id")
    .join("Team as team", "r.team_id", "team.id")
    .where("td.tournament_id", tournament_id)
    .andWhere("td.id", division_id)
    .andWhere("r.status", "registered")
    .select(
      "r.id as registration_id",
      "r.team_id",
      "r.tournament_division_id",
      "r.seed",
      "r.group_id",
      "team.name as team_name"
    )
    .orderByRaw("r.seed IS NULL ASC")
    .orderBy("r.seed", "asc")
    .orderBy("r.id", "asc");
};

const getDivisionPools = async (tournament_id, division_id) => {
  const registrations = await getDivisionRegistrationsForPools(
    tournament_id,
    division_id
  );

  const poolMap = new Map();
  const unassigned = [];

  registrations.forEach((registration) => {
    if (!registration.group_id) {
      unassigned.push(registration);
      return;
    }

    if (!poolMap.has(registration.group_id)) {
      poolMap.set(registration.group_id, []);
    }
    poolMap.get(registration.group_id).push(registration);
  });

  const pools = [...poolMap.entries()]
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([poolNumber, teams]) => ({
      pool_number: Number(poolNumber),
      teams: teams.sort((a, b) => Number(a.seed || 9999) - Number(b.seed || 9999)),
    }));

  return {
    tournament_id: Number(tournament_id),
    tournament_division_id: Number(division_id),
    pools,
    unassigned,
  };
};

const generateDivisionPoolsSnake = async (
  tournament_id,
  division_id,
  { pool_count }
) => {
  const poolCount = Number(pool_count);
  if (!Number.isInteger(poolCount) || poolCount <= 0) {
    throw new BadRequestError("pool_count must be a positive integer");
  }

  const registrations = await getDivisionRegistrationsForPools(
    tournament_id,
    division_id
  );

  if (!registrations.length) {
    throw new NotFoundError("No registered teams found for this division");
  }

  const missingSeed = registrations.find((registration) => {
    const seedValue = Number(registration.seed);
    return (
      registration.seed === null ||
      registration.seed === undefined ||
      registration.seed === "" ||
      !Number.isInteger(seedValue) ||
      seedValue <= 0
    );
  });
  if (missingSeed) {
    throw new BadRequestError(
      "All registered teams must have a numeric seed before generating pools"
    );
  }

  const seeds = registrations.map((registration) => Number(registration.seed));
  const duplicateSeed = seeds.find(
    (seed, index) => seeds.indexOf(seed) !== index
  );
  if (duplicateSeed !== undefined) {
    throw new BadRequestError(
      `Duplicate seed detected (${duplicateSeed}). Seeds must be unique within the division`
    );
  }

  const sortedBySeed = [...registrations].sort(
    (a, b) => Number(a.seed) - Number(b.seed)
  );

  let poolIndex = 0;
  let direction = 1;
  const assignments = sortedBySeed.map((registration) => {
    const assignedPool = poolIndex + 1;

    if (poolCount > 1) {
      if (direction === 1) {
        if (poolIndex === poolCount - 1) {
          direction = -1;
        } else {
          poolIndex += 1;
        }
      } else if (poolIndex === 0) {
        direction = 1;
      } else {
        poolIndex -= 1;
      }
    }

    return {
      registration_id: registration.registration_id,
      group_id: assignedPool,
    };
  });

  await knex.transaction(async (trx) => {
    await Promise.all(
      assignments.map((assignment) =>
        trx("Registration")
          .where({ id: assignment.registration_id })
          .update({ group_id: assignment.group_id })
      )
    );
  });

  return getDivisionPools(tournament_id, division_id);
};

module.exports = {
  createTournamentDivision,
  generateDivisionPoolsSnake,
  getDivisionPools,
  getTournamentDivisions,
};
