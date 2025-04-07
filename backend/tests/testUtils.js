const request = require("supertest");
const { app } = require("../index");

const registerUser = async (userData) => {
  const res = await request(app).post("/api/auth/register").send(userData);
  if (res.statusCode !== 201) {
    throw new Error(`Failed to register user: ${res.body.message}`);
  }
  return res.body; // Return the registered user
};

const loginUser = async (email, password) => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });
  if (res.statusCode !== 200) {
    throw new Error(`Failed to log in: ${res.body.message}`);
  }
  return res.body.token; // Return the auth token
};

const createTeam = async (token, teamData) => {
  const res = await request(app)
    .post("/api/teams")
    .set("Authorization", `Bearer ${token}`)
    .send(teamData);
  if (res.statusCode !== 201) {
    throw new Error(`Failed to create team: ${res.body.message}`);
  }
  return res.body; // Return the created team
};

const createTournament = async (token, tournamentData) => {
  const res = await request(app)
    .post("/api/tournaments")
    .set("Authorization", `Bearer ${token}`)
    .send(tournamentData);
  if (res.statusCode !== 201) {
    throw new Error(`Failed to create tournament: ${res.body.message}`);
  }
  return res.body; // Return the created tournament
};

const setupTestUser = async (userData = null) => {
  const uniqueId = Date.now();
  const defaultUserData = {
    first_name: "Global",
    last_name: "User",
    username: `testuser_${uniqueId}`,
    email: `testuser_${uniqueId}@example.com`,
    password: "testpassword123",
    gender: "male",
    city: "Global City",
    state_province: "Global State",
    zip_code: "12345",
    country: "Global Country",
    phone_number: "123-456-7890",
    date_of_birth: "1990-01-01",
  };

  const finalUserData = userData || defaultUserData;

  const registeredUser = await registerUser(finalUserData);

  const token = await loginUser(finalUserData.email, finalUserData.password);

  return { ...registeredUser, token };
};

const setupTestTournament = async (authToken, tournamentData = null) => {
  const defaultTournamentData = {
    name: "Test Tournament",
    start_date: "2023-01-01",
    end_date: "2023-01-02",
    city: "Test City",
    state: "Test State",
    country: "Test Country",
    zip_code: "12345",
    timezone: "EST",
    status: "Upcoming",
    format: "classic",
    max_teams: 16,
  };

  const finalTournamentData = tournamentData || defaultTournamentData;

  const res = await createTournament(authToken, finalTournamentData);

  return res; // Return the created tournament
};

const setupTestTeam = async (authToken, teamData = null) => {
  const defaultTeamData = {
    name: "Test Team",
    city: "Test City",
    state: "Test State",
    country: "Test Country",
    zip_code: "12345",
    timezone: "EST",
    status: "Active",
  };

  const finalTeamData = teamData || defaultTeamData;

  const res = await createTeam(authToken, finalTeamData);

  return res; // Return the created team
};

module.exports = {
  registerUser,
  loginUser,
  createTeam,
  createTournament,
  setupTestUser,
  setupTestTournament,
  setupTestTeam,
};
