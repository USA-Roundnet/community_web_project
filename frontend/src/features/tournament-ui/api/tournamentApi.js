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

export const getTournamentList = () => apiRequest("/api/tournaments");

export const getTournament = (tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}`);

export const createTournament = (token, body) =>
  apiRequest("/api/tournaments", {
    method: "POST",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const updateTournament = (token, tournamentId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}`, {
    method: "PUT",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const deleteTournament = (token, tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}`, {
    method: "DELETE",
    headers: withAuthHeaders(token),
  });

export const getTournamentDetails = (token, tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}/details`, {
    headers: withAuthHeaders(token),
  });

export const getTournamentDivisions = (token, tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}/divisions`, {
    headers: withAuthHeaders(token),
  });

export const createTournamentDivision = (token, tournamentId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}/divisions`, {
    method: "POST",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const getTournamentRegistrations = (
  token,
  tournamentId,
  { divisionId, paymentStatus } = {}
) => {
  const params = new URLSearchParams();
  if (divisionId) {
    params.set("division_id", `${divisionId}`);
  }
  if (paymentStatus) {
    params.set("payment_status", paymentStatus);
  }
  const query = params.toString();

  return apiRequest(
    `/api/tournaments/${tournamentId}/registrations${query ? `?${query}` : ""}`,
    {
      headers: withAuthHeaders(token),
    }
  );
};

export const reorderTournamentRegistrations = (token, tournamentId, updates) =>
  apiRequest(`/api/tournaments/${tournamentId}/registrations/reorder`, {
    method: "PATCH",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify({ updates }),
  });

export const getMatchCandidates = (token, tournamentId, divisionId) => {
  const query = divisionId ? `?division_id=${divisionId}` : "";
  return apiRequest(`/api/tournaments/${tournamentId}/matches/candidates${query}`, {
    headers: withAuthHeaders(token),
  });
};

export const getMatches = (token, tournamentId, { divisionId, date } = {}) => {
  const params = new URLSearchParams();
  if (divisionId) {
    params.set("division_id", `${divisionId}`);
  }
  if (date) {
    params.set("date", date);
  }

  const query = params.toString();
  return apiRequest(`/api/tournaments/${tournamentId}/matches${query ? `?${query}` : ""}`, {
    headers: withAuthHeaders(token),
  });
};

export const createMatch = (token, tournamentId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}/matches`, {
    method: "POST",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const updateMatch = (token, tournamentId, matchId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}/matches/${matchId}`, {
    method: "PATCH",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const saveMatchResults = (token, tournamentId, matchId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}/matches/${matchId}/results`, {
    method: "POST",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const generatePools = (token, tournamentId, divisionId, body) =>
  apiRequest(`/api/tournaments/${tournamentId}/divisions/${divisionId}/pools/generate`, {
    method: "POST",
    headers: withAuthHeaders(token, defaultJsonHeaders),
    body: JSON.stringify(body),
  });

export const autoGeneratePoolMatches = (token, tournamentId, divisionId, body) =>
  apiRequest(
    `/api/tournaments/${tournamentId}/divisions/${divisionId}/matches/auto-generate`,
    {
      method: "POST",
      headers: withAuthHeaders(token, defaultJsonHeaders),
      body: JSON.stringify(body),
    }
  );

export const getTournamentStats = (token, tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}/stats`, {
    headers: withAuthHeaders(token),
  });

export const getMyMatchAlerts = (token, tournamentId) =>
  apiRequest(`/api/tournaments/${tournamentId}/my-match-alerts`, {
    headers: withAuthHeaders(token),
  });
