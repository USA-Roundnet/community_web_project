const request = require("supertest");
const { app } = require("../index");

describe("Team Controller API Tests", () => {
  let testTeamId;
  let testUserId;
  let authToken;

  beforeAll(async () => {
    // Create test user
    const userRes = await request(app).post("/api/auth/register").send({
      username: "teamtestuser",
      email: "teamtest@example.com",
      password: "testpassword123",
    });
    testUserId = userRes.body.id;

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "teamtest@example.com",
      password: "testpassword123",
    });
    authToken = loginRes.body.token;
  });

  test("POST /api/teams should create a new team", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Team",
        description: "Test Description",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    testTeamId = res.body.id;
  });

  test("GET /api/teams should return all teams", async () => {
    const res = await request(app)
      .get("/api/teams")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === testTeamId)).toBe(true);
  });

  test("GET /api/teams/:id should return a specific team", async () => {
    const res = await request(app)
      .get(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTeamId);
  });

  test("PUT /api/teams/:id should update a team", async () => {
    const res = await request(app)
      .put(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Updated Team Name",
        description: "Updated Description",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Team Name");
  });

  test("DELETE /api/teams/:id should delete a team", async () => {
    const res = await request(app)
      .delete(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
