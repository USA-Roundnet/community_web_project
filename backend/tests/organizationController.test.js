const request = require("supertest"); // Supertest for API testing
const { app, server } = require("../index"); // Import both app and server
const db = require("../knex-config"); // Import database connection

beforeAll(async () => {
  console.log("Running migrations...");
  await db.migrate.latest();
  console.log("Running seeds...");
  await db.seed.run();
});

afterAll(async () => {
  console.log("Closing database connection...");
  await db.destroy(); // Close DB connection

  console.log("Closing server...");
  if (server && server.close) {
    await new Promise((resolve) => server.close(resolve));
  }
});

describe("Organization Controller API Tests", () => {
  let testOrgId;

  test("GET /api/organizations should return a list of organizations", async () => {
    const res = await request(app).get("/api/organizations");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/organizations should create a new organization", async () => {
    const newOrg = { name: "Test Organization", location: "Test City" };

    const res = await request(app)
      .post("/api/organizations")
      .send(newOrg)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(newOrg.name);

    testOrgId = res.body.id; // Store for later tests
  });

  test("GET /api/organizations/:id should return a single organization", async () => {
    const res = await request(app).get(`/api/organizations/${testOrgId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testOrgId);
    expect(res.body).toHaveProperty("name", "Test Organization");
  });

  test("PUT /api/organizations/:id should update an organization", async () => {
    const updatedOrg = {
      name: "Updated Organization",
      location: "Updated City",
    };

    const res = await request(app)
      .put(`/api/organizations/${testOrgId}`)
      .send(updatedOrg)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedOrg.name);
  });

  test("DELETE /api/organizations/:id should delete an organization", async () => {
    const res = await request(app).delete(`/api/organizations/${testOrgId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Organization deleted successfully"
    );

    // Verify deletion
    const checkRes = await request(app).get(`/api/organizations/${testOrgId}`);
    expect(checkRes.statusCode).toBe(404);
  });

  test("POST /api/organizations should return 400 for invalid input", async () => {
    const invalidOrg = { location: "Test City" }; // Missing required 'name' field

    const res = await request(app)
      .post("/api/organizations")
      .send(invalidOrg)
      .set("Accept", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Validation failed");
  });
});
