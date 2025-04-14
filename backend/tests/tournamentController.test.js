const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser } = require("./testUtils.js");
const { serve } = require("swagger-ui-express");
const { format } = require("morgan");

describe("Tournament Controller API Tests", () => {
  let testUserObject;
  let testTeamId;
  let testTournamentId;
  let tournamentDivisionId;
  let registrationId;
  let deleteTestTournamentId;

  let server;

  beforeAll(async () => {
    server = startServer(); // Explicitly start the server

    // Use the global setupTestUser to register and log in a test user
    try {
      testUserObject = await setupTestUser();
      // console.log("Test user created:", { id: testUserObject.id, token: testUserObject.token });

      // Insert a team and retrieve the inserted row
      const teamRes = await knex("Team").insert({
        name: "Test Team",
        public: true,
        size: 2,
        description: "Test Team Description",
        created_at: new Date(),
      });

      testTeamId = teamRes[0];
      // console.log("Test team created, id:", testTeamId);

      // Have the test user join the team
      const joinTeam = await knex("UserTeam").insert({
        user_id: testUserObject.id,
        team_id: testTeamId,
        status: "Accepted",
        created_at: new Date(),
      });

      // console.log("Test user joined team, Team id:", testTeamId, "UserTeam id:", joinTeam[0]);

      // Create a test tournament
      const tournament = await knex("Tournament").insert({
        name: "Test Tournament",
        status: "upcoming",
        format: "college",
        start_date: "2025-05-01",
        end_date: "2025-05-03",
        director_id: testUserObject.id,
      });

      testTournamentId = tournament[0];
      console.log("Test tournament created, Tournament id:", testTournamentId);

      const tournamentDivision = await knex("TournamentDivision").insert({
        division_id: 1,
        tournament_id: testTournamentId,
        registration_fee: 50,
        created_at: new Date(),
      });

      tournamentDivisionId = tournamentDivision[0];
      console.log(
        "Inserting into TournamentDivision table, id:",
        testTournamentId
      );

      // Verify the TournamentDivision exists in the database
      const divisionTest = await knex("TournamentDivision")
        .where({ id: tournamentDivisionId })
        .first();
      console.log("TournamentDivision in database:", divisionTest);

      // const registration = await knex("Registration").insert({
      //   team_id: testTeamId,
      //   tournament_division_id: tournamentDivisionId,
      //   status: "registered",
      //   payment_status: "unpaid",
      //   created_at: new Date(),
      // });

      // registrationId = registration[0];
      // console.log("Test registration created, Registration id:", registrationId);

      // const registrationTest = await knex("Registration")
      //   .where({
      //     team_id: testTeamId,
      //     tournament_division_id: tournamentDivisionId,
      //   })
      //   .first();

      // console.log("Registration in beforeAll:", registrationTest);
    } catch (error) {
      console.error("Error in beforeAll:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    // Clean up the database after tests
    try {
      if (testUserObject.id) {
        await knex("User").where({ id: testUserObject.id }).del();
        // console.log("Test user deleted:", testUserObject.id);
      }
      if (testTeamId) {
        await knex("Team").where({ id: testTeamId }).del();
      }
      if (testTournamentId) {
        await knex("Tournament").where({ id: testTournamentId }).del();
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
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Test Tournament",
        status: "upcoming",
        format: "college",
        start_date: "2023-01-01",
        end_date: "2023-01-02",
        director_id: testUserObject.id,
      });

    deleteTestTournamentId = res.body.id;

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    // console.log("Tournament created successfully:", res.body);
  });

  test("GET /api/tournaments should return all tournaments", async () => {
    const res = await request(app)
      .get("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === testTournamentId)).toBe(true);
  });

  test("GET /api/tournaments/:id should return a specific tournament", async () => {
    const res = await request(app)
      .get(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testTournamentId);
  });

  test("PUT /api/tournaments/:id should update a tournament", async () => {
    const res = await request(app)
      .put(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Updated Tournament Name",
        status: "upcoming",
        format: "college",
        start_date: "2025-05-01",
        end_date: "2025-05-03",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Tournament Name");
  });
  // TODO dont delete the tournament in the test and try to run tests on that same tournament
  test("DELETE /api/tournaments/:id should delete a tournament", async () => {
    const res = await request(app)
      .delete(`/api/tournaments/${deleteTestTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(200);

    // Verify deletion
    const checkRes = await request(app)
      .get(`/api/tournaments/${deleteTestTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`);
    expect(checkRes.statusCode).toBe(404);
  });

  test("POST /api/tournaments/:id/register should register a team for a tournament", async () => {
    // Register the team for the tournament division
    const res = await request(app)
      .post(`/api/tournaments/${testTournamentId}/register`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
        status: "registered",
        payment_status: "unpaid",
        created_at: new Date(),
      });
    registrationId = res.body;
    // console.log("Registration ID:", registrationId);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    // Verify the registration exists in the database
    const registration = await knex("Registration")
      .where({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      })
      .first();

    expect(registration).not.toBeNull();
    expect(registration.team_id).toBe(testTeamId);
    expect(registration.tournament_division_id).toBe(tournamentDivisionId);

    // Verify the user is linked to the tournament in the TournamentUser table
    const tournamentUser = await knex("TournamentUser")
      .where({
        user_id: testUserObject.id,
        tournament_division_id: tournamentDivisionId,
      })
      .first();
    expect(tournamentUser).not.toBeNull();
    expect(tournamentUser.tournament_division_id).toBe(tournamentDivisionId);
  });

  test("GET /api/tournaments/:id/teams should return all teams registered for a tournament", async () => {
    // Fetch all teams for the tournament
    const res = await request(app)
      .get(`/api/tournaments/${testTournamentId}/teams`)
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((team) => team.id === testTeamId)).toBe(true);
  });

  // test("GET /api/users/:id/tournaments should return tournaments a user is registered for", async () => {
  //   // Fetch tournaments for the test user
  //   const res = await request(app)
  //     .get(`/api/users/${testUserObject.id}/tournaments`)
  //     .set("Authorization", `Bearer ${testUserObject.token}`);

  //   expect(res.statusCode).toBe(200);
  //   expect(Array.isArray(res.body)).toBe(true);
  //   expect(res.body.some((t) => t.id === testTournamentId)).toBe(true);
  // });

  // test("GET /api/tournaments/:id/teams should return 404 for a non-existent tournament", async () => {
  //   const res = await request(app)
  //     .get("/api/tournaments/999999/teams") // Non-existent tournament ID
  //     .set("Authorization", `Bearer ${testUserAuthToken}`);

  //   expect(res.statusCode).toBe(404);
  //   expect(res.body.message).toBe("Tournament not found");
  // });

  // test("POST /api/tournaments/:id/register should return 404 for a non-existent tournament", async () => {
  //   const res = await request(app)
  //     .post("/api/tournaments/999999/register") // Non-existent tournament ID
  //     .set("Authorization", `Bearer ${testUserAuthToken}`)
  //     .send({
  //       team_id: testTeamId,
  //       division: "Open",
  //     });

  //   expect(res.statusCode).toBe(404);
  //   expect(res.body.message).toBe("Tournament not found");
  // });

  // test("POST /api/tournaments/:id/register should prevent duplicate registrations", async () => {
  //   // First registration
  //   const firstRes = await request(app)
  //     .post(`/api/tournaments/${testTournamentId}/register`)
  //     .set("Authorization", `Bearer ${testUserAuthToken}`)
  //     .send({
  //       team_id: testTeamId,
  //       division: "Open",
  //     });

  //   expect(firstRes.statusCode).toBe(201);

  //   // Duplicate registration
  //   const secondRes = await request(app)
  //     .post(`/api/tournaments/${testTournamentId}/register`)
  //     .set("Authorization", `Bearer ${testUserAuthToken}`)
  //     .send({
  //       team_id: testTeamId,
  //       division: "Open",
  //     });

  //   expect(secondRes.statusCode).toBe(400);
  //   expect(secondRes.body.message).toBe("Team is already registered for this tournament");
  // });
});
