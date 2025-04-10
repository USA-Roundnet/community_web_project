const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser } = require("./testUtils.js");
const { serve } = require("swagger-ui-express");

describe("Tournament Controller API Tests", () => {
  let testUserAuthToken;
  let testUserId;
  let testTeamId;
  let testTournamentId;

  let Server;

  beforeAll(async () => {
    server = startServer(); // Explicitly start the server

    // Use the global setupTestUser to register and log in a test user
    try {
      const { id, token } = await setupTestUser();
      testUserId = id;
      testUserAuthToken = token;
      console.log("Test user created:", { testUserId, testUserAuthToken });
    } catch (error) {
      console.error("Error in beforeAll:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    // Clean up the database after tests
    try {
      if (testUserId) {
        await knex("User").where({ id: testUserId }).del();
        console.log("Test user deleted:", testUserId);
      }
    } catch (error) {
      console.error("Error in afterAll:", error.message);
      throw error;
    }
    stopServer(); // Explicitly stop the server
    await knex.destroy(); // Close the database connection
  });

  test("POST /api/tournaments should create a tournament", async () => {
    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserAuthToken}`)
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
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === testTournamentId)).toBe(true);
  });

  test("GET /api/tournaments/:id should return a specific tournament", async () => {
    const res = await request(app)
      .get(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTournamentId);
  });

  test("PUT /api/tournaments/:id should update a tournament", async () => {
    const res = await request(app)
      .put(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`)
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
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
