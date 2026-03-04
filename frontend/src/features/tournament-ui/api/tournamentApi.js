import { API_BASE_URL } from "../../../config";
import { parseJsonSafely } from "../../../utils/http";

const defaultJsonHeaders = {
  "Content-Type": "application/json",
};

const withAuthHeaders = (token, headers = {}) => {
  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

const apiRequest = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(
      payload?.message || `Request failed (${response.status})`
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
};

const authRequest = (token, path, options = {}) =>
  apiRequest(path, {
    ...options,
    headers: withAuthHeaders(token, options.headers || {}),
  });

const authJsonRequest = (token, path, method, body) =>
  authRequest(token, path, {
    method,
    headers: defaultJsonHeaders,
    body: JSON.stringify(body),
  });

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, `${value}`);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const getTournamentList = () => apiRequest("/api/tournaments");

export const getTournament = (tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}`);

export const createTournament = (token, body) =>
  authJsonRequest(token, "/api/tournaments", "POST", body);

export const updateTournament = (token, tournamentId, body) =>
  authJsonRequest(token, `/api/tournaments/${tournamentId}`, "PUT", body);

export const deleteTournament = (token, tournamentId) =>
  authRequest(token, `/api/tournaments/${tournamentId}`, {
    method: "DELETE",
  });

export const getTournamentDetails = (token, tournamentId) =>
  authRequest(token, `/api/tournaments/${tournamentId}/details`);

export const getTournamentDivisions = (token, tournamentId) =>
  authRequest(token, `/api/tournaments/${tournamentId}/divisions`);

export const createTournamentDivision = (token, tournamentId, body) =>
  authJsonRequest(token, `/api/tournaments/${tournamentId}/divisions`, "POST", body);

export const getTournamentRegistrations = (
  token,
  tournamentId,
  { divisionId, paymentStatus } = {}
) => {
  return authRequest(
    token,
    `/api/tournaments/${tournamentId}/registrations${buildQueryString({
      division_id: divisionId,
      payment_status: paymentStatus,
    })}`
  );
};

export const reorderTournamentRegistrations = (token, tournamentId, updates) =>
  authJsonRequest(
    token,
    `/api/tournaments/${tournamentId}/registrations/reorder`,
    "PATCH",
    { updates }
  );

export const getMatchCandidates = (token, tournamentId, divisionId) => {
  return authRequest(
    token,
    `/api/tournaments/${tournamentId}/matches/candidates${buildQueryString({
      division_id: divisionId,
    })}`
  );
};

export const getMatches = (token, tournamentId, { divisionId, date } = {}) => {
  return authRequest(
    token,
    `/api/tournaments/${tournamentId}/matches${buildQueryString({
      division_id: divisionId,
      date,
    })}`
  );
};

export const createMatch = (token, tournamentId, body) =>
  authJsonRequest(token, `/api/tournaments/${tournamentId}/matches`, "POST", body);

export const updateMatch = (token, tournamentId, matchId, body) =>
  authJsonRequest(
    token,
    `/api/tournaments/${tournamentId}/matches/${matchId}`,
    "PATCH",
    body
  );

export const saveMatchResults = (token, tournamentId, matchId, body) =>
  authJsonRequest(
    token,
    `/api/tournaments/${tournamentId}/matches/${matchId}/results`,
    "POST",
    body
  );

export const generatePools = (token, tournamentId, divisionId, body) =>
  authJsonRequest(
    token,
    `/api/tournaments/${tournamentId}/divisions/${divisionId}/pools/generate`,
    "POST",
    body
  );

export const autoGeneratePoolMatches = (token, tournamentId, divisionId, body) =>
  authJsonRequest(
    token,
    `/api/tournaments/${tournamentId}/divisions/${divisionId}/matches/auto-generate`,
    "POST",
    body
  );

export const getTournamentStats = (token, tournamentId) =>
  authRequest(token, `/api/tournaments/${tournamentId}/stats`);

export const getMyMatchAlerts = (token, tournamentId) =>
  authRequest(token, `/api/tournaments/${tournamentId}/my-match-alerts`);
