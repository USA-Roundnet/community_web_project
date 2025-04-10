const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser } = require("./testUtils.js");

describe("Organization Controller API Tests", () => {
  let testUserAuthToken;
  let testUserId;
  let testOrganizationId;

  let server;

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

  test("POST /api/organizations should create an organization", async () => {
    const res = await request(app)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${testUserAuthToken}`)
      .send({
        name: "Test Organization",
        location: "Test Location",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    testOrganizationId = res.body.id;
  });

  test("GET /api/organizations should return all organizations", async () => {
    const res = await request(app)
      .get("/api/organizations")
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((org) => org.id === testOrganizationId)).toBe(true);
  });

  test("GET /api/organizations/:id should return a specific organization", async () => {
    const res = await request(app)
      .get(`/api/organizations/${testOrganizationId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testOrganizationId);
  });

  test("PUT /api/organizations/:id should update an organization", async () => {
    const res = await request(app)
      .put(`/api/organizations/${testOrganizationId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`)
      .send({
        name: "Updated Organization Name",
        location: "Updated Location",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Organization Name");
  });

  test("DELETE /api/organizations/:id should delete an organization", async () => {
    const res = await request(app)
      .delete(`/api/organizations/${testOrganizationId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);

    expect(res.statusCode).toBe(200);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/organizations/${testOrganizationId}`)
      .set("Authorization", `Bearer ${testUserAuthToken}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
