const request = require("supertest");
const { app, server } = require("../index");
const db = require("../knex-config");

beforeAll(async () => {
  await db.migrate.rollback({ all: true });
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
  if (server && server.close) {
    server.close();
  }
});

describe("Team Controller API Tests", () => {
  let testTeamId;

  test("GET /api/teams should return a list of teams", async () => {
    const res = await request(app).get("/api/teams");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/teams should create a new team", async () => {
    const newTeam = {
      name: "Test Team",
      public: true,
      size: 5,
      description: "A test team",
    };

    const res = await request(app)
      .post("/api/teams")
      .send(newTeam)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(newTeam.name);

    testTeamId = res.body.id; // Store for later tests
  });

  test("GET /api/teams/:id should return a single team", async () => {
    const res = await request(app).get(`/api/teams/${testTeamId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testTeamId);
    expect(res.body).toHaveProperty("name", "Test Team");
  });

  test("PUT /api/teams/:id should update a team", async () => {
    const updatedTeam = {
      name: "Updated Team",
      public: false,
      size: 3,
      description: "An updated team",
    };

    const res = await request(app)
      .put(`/api/teams/${testTeamId}`)
      .send(updatedTeam)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedTeam.name);
  });

  test("DELETE /api/teams/:id should delete a team", async () => {
    const res = await request(app).delete(`/api/teams/${testTeamId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Team deleted successfully");

    // Verify deletion
    const checkRes = await request(app).get(`/api/teams/${testTeamId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
