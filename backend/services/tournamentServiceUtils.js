const { BadRequestError } = require("../utils/customErrors");

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_ONLY_REGEX = /^\d{2}:\d{2}$/;

const toIsoDateOnly = (dateValue) => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString().slice(0, 10);
};

const toSqlDateTime = (dateValue) => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");
  const seconds = String(dateValue.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

const getTournamentScoreRules = (tournament) => {
  const targetScore = Number(tournament?.points_to_win || 21);
  const overtimeCap = Number(tournament?.overtime_cap || 25);
  const winBy = Number(tournament?.win_by || 2);

  return {
    target_score: Number.isInteger(targetScore) && targetScore > 0 ? targetScore : 21,
    overtime_cap: Number.isInteger(overtimeCap) && overtimeCap > 0 ? overtimeCap : 25,
    win_by: Number.isInteger(winBy) && winBy > 0 ? winBy : 2,
  };
};

const validateDateAndTimeFormat = (scheduledDate, scheduledTime) => {
  if (!DATE_ONLY_REGEX.test(scheduledDate)) {
    throw new BadRequestError("scheduled_date must be in YYYY-MM-DD format");
  }
  if (!TIME_ONLY_REGEX.test(scheduledTime)) {
    throw new BadRequestError("scheduled_time must be in HH:mm format");
  }
};

const parseScheduledDateTime = (
  scheduledDate,
  scheduledTime,
  errorMessage = "Invalid scheduled date/time"
) => {
  const parsed = new Date(`${scheduledDate}T${scheduledTime}:00`);
  if (Number.isNaN(parsed.getTime())) {
    throw new BadRequestError(errorMessage);
  }
  return parsed;
};

module.exports = {
  buildTournamentWritePayload,
  deriveTournamentStatus,
  getTournamentScoreRules,
  parseScheduledDateTime,
  toIsoDateOnly,
  toSqlDateTime,
  validateDateAndTimeFormat,
};
