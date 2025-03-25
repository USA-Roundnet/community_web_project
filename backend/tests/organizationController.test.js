const request = require("supertest");
const { app } = require("../index");

describe("Organization Controller API Tests", () => {
  let testOrgId;

  test("GET /api/organizations should return a list of organizations", async () => {
    const res = await request(app).get("/api/organizations");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/organizations should create a new organization", async () => {
    const newOrg = { name: "Test Organization", location: "Test City" };
    const res = await request(app).post("/api/organizations").send(newOrg);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    testOrgId = res.body.id;
  });

  test("GET /api/organizations/:id should return a single organization", async () => {
    const res = await request(app).get(`/api/organizations/${testOrgId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", testOrgId);
  });

  test("PUT /api/organizations/:id should update an organization", async () => {
    const updatedOrg = { name: "Updated Organization" };
    const res = await request(app)
      .put(`/api/organizations/${testOrgId}`)
      .send(updatedOrg);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedOrg.name);
  });

  test("DELETE /api/organizations/:id should delete an organization", async () => {
    const res = await request(app).delete(`/api/organizations/${testOrgId}`);
    expect(res.statusCode).toBe(200);

    const checkRes = await request(app).get(`/api/organizations/${testOrgId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
