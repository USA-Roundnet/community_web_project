const request = require('supertest'); // Supertest for API testing
const { app, server } = require('../index'); // Import both app and server
const db = require('../knex'); // Import database connection

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy(); // Close DB connection

  if (server && server.close) {
    server.close();
  }
});

describe('Organization Controller API Tests', () => {
  let testOrgId;

  test('GET /api/organizations should return a list of organizations', async () => {
    const res = await request(app).get('/api/organizations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/organizations should create a new organization', async () => {
    const newOrg = { name: 'Test Organization', location: 'Test City' };

    const res = await request(app)
      .post('/api/organizations')
      .send(newOrg)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newOrg.name);

    testOrgId = res.body.id; // Store for later tests
  });

  test('GET /api/organizations/:id should return a single organization', async () => {
    const res = await request(app).get(`/api/organizations/${testOrgId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', testOrgId);
    expect(res.body).toHaveProperty('name', 'Test Organization');
  });

  test('PUT /api/organizations/:id should update an organization', async () => {
    const updatedOrg = { name: 'Updated Organization', location: 'Updated City' };

    const res = await request(app)
      .put(`/api/organizations/${testOrgId}`)
      .send(updatedOrg)
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updatedOrg.name);
  });

  test('DELETE /api/organizations/:id should delete an organization', async () => {
    const res = await request(app).delete(`/api/organizations/${testOrgId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Organization deleted successfully');

    // Verify deletion
    const checkRes = await request(app).get(`/api/organizations/${testOrgId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
