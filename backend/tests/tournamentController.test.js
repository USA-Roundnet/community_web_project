const request = require("supertest");
const { app } = require("../index");

describe("Tournament Controller API Tests", () => {
  let testTournamentId;
  let testTeamId;
  let authToken;

  beforeAll(async () => {
    // Create test user
    const userRes = await request(app).post("/api/auth/register").send({
      username: "tournamenttestuser",
      email: "tournamenttest@example.com",
      password: "testpassword123",
    });

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "tournamenttest@example.com",
      password: "testpassword123",
    });
    authToken = loginRes.body.token;

    // Create test team
    const teamRes = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Tournament Test Team",
      });
    testTeamId = teamRes.body.id;
  });

  test("POST /api/tournaments should create a tournament", async () => {
    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Tournament",
        start_date: "2023-01-01",
        end_date: "2023-01-02",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    testTournamentId = res.body.id;
  });

  test("GET /api/tournaments should return all tournaments", async () => {
    const res = await request(app)
      .get("/api/tournaments")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === testTournamentId)).toBe(true);
  });

  test("GET /api/tournaments/:id should return a specific tournament", async () => {
    const res = await request(app)
      .get(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTournamentId);
  });

  test("PUT /api/tournaments/:id should update a tournament", async () => {
    const res = await request(app)
      .put(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Tournament Name",
        description: "New Description",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Tournament Name");
  });

  test("DELETE /api/tournaments/:id should delete a tournament", async () => {
    const res = await request(app)
      .delete(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
