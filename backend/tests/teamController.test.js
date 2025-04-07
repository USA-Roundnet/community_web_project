const request = require("supertest");
const { app } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser } = require("./testUtils.js");

describe("Team Controller API Tests", () => {
  let testUserAuthToken;
  let testUserId;
  let testTeamId;

  beforeAll(async () => {
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
    try {
      if (testUserId) {
        await knex("User").where({ id: testUserId }).del();
        console.log("Test user deleted:", testUserId);
      }
    } catch (error) {
      console.error("Error in afterAll:", error.message);
      throw error;
    }
    await knex.destroy(); // Close the database connection
  });

  test("POST /api/teams should create a team", async () => {
    const res = await request(app)
      .post("/api/teams")
      .set("Authorization", `Bearer ${testUserAuthToken}`)
      .send({
        name: "Test Team",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    testTeamId = res.body.id;
  });

  test("GET /api/teams should return all teams", async () => {
    const res = await request(app)
      .get("/api/teams")
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((team) => team.id === testTeamId)).toBe(true);
  });

  test("DELETE /api/teams/:id should delete a team", async () => {
    const res = await request(app)
      .delete(`/api/teams/${testTeamId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
  });
});
