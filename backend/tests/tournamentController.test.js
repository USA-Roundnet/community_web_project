const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser } = require("./testUtils.js");

const dateWithOffset = (daysFromToday) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
};

const dateTimeWithOffset = (daysFromToday) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

describe("Tournament Controller API Tests", () => {
  let testUserObject;
  let otherUserObject;
  let testTeamId;
  let testTournamentId;
  let tournamentDivisionId;
  let deleteTestTournamentId;
  let statusTournamentUpcomingId;
  let statusTournamentInProgressId;
  let statusTournamentCompletedId;
  let cascadeDeleteTournamentId;
  let cascadeDeleteDivisionId;

  let server;

  beforeAll(async () => {
    server = startServer(); // Explicitly start the server

    // Use the global setupTestUser to register and log in a test user
    try {
      testUserObject = await setupTestUser();
      otherUserObject = await setupTestUser();
      // console.log("Test user created:", { id: testUserObject.id, token: testUserObject.token });

      // Insert a team and retrieve the inserted row
      const teamRes = await knex("Team").insert({
        name: "Test Team",
        public: true,
        description: "Test Team Description",
        created_at: new Date(),
      });

      testTeamId = teamRes[0];
      // console.log("Test team created, id:", testTeamId);

      // Have the test user join the team
      await knex("UserTeam").insert({
        user_id: testUserObject.id,
        team_id: testTeamId,
        role: "player",
        status: "accepted",
        created_at: new Date(),
      });

      // Create a test tournament
      const baseStartDate = dateWithOffset(7);
      const baseEndDate = dateWithOffset(9);
      const tournament = await knex("Tournament").insert({
        name: "Test Tournament",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        timezone: "America/New_York",
        status: "upcoming",
        format: "college",
        start_date: baseStartDate,
        end_date: baseEndDate,
        max_teams: 24,
        director_id: testUserObject.id,
      });

      testTournamentId = tournament[0];
      // console.log("Test tournament created, Tournament id:", testTournamentId);

      const tournamentDivision = await knex("TournamentDivision").insert({
        division_id: 1,
        tournament_id: testTournamentId,
        registration_fee: 50,
        created_at: new Date(),
      });

      tournamentDivisionId = tournamentDivision[0];
      // console.log("Inserting into TournamentDivision table, id:", testTournamentId);

      // Verify the TournamentDivision exists in the database
      await knex("TournamentDivision").where({ id: tournamentDivisionId }).first();
    } catch (error) {
      console.error("Error in beforeAll:", error.message);
      throw error;
    }
  });

  const createScheduleFixture = async ({
    teamOneUserIds = [testUserObject.id],
    teamTwoUserIds = [testUserObject.id],
    registrationOneStatus = "registered",
    registrationTwoStatus = "registered",
  } = {}) => {
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;

    const [teamOneId] = await knex("Team").insert({
      name: `Schedule Team One ${uniqueSuffix}`,
      public: true,
      description: "Team used for scheduling tests",
      created_at: new Date(),
    });

    const [teamTwoId] = await knex("Team").insert({
      name: `Schedule Team Two ${uniqueSuffix}`,
      public: true,
      description: "Team used for scheduling tests",
      created_at: new Date(),
    });

    const teamMembershipRows = [
      ...teamOneUserIds.map((userId) => ({
        user_id: userId,
        team_id: teamOneId,
        role: "player",
        status: "accepted",
        created_at: new Date(),
      })),
      ...teamTwoUserIds.map((userId) => ({
        user_id: userId,
        team_id: teamTwoId,
        role: "player",
        status: "accepted",
        created_at: new Date(),
      })),
    ];

    if (teamMembershipRows.length) {
      await knex("UserTeam").insert(teamMembershipRows);
    }

    const [registrationOneId] = await knex("Registration").insert({
      team_id: teamOneId,
      tournament_division_id: tournamentDivisionId,
      status: registrationOneStatus,
      payment_status: "unpaid",
      created_at: new Date(),
    });

    const [registrationTwoId] = await knex("Registration").insert({
      team_id: teamTwoId,
      tournament_division_id: tournamentDivisionId,
      status: registrationTwoStatus,
      payment_status: "unpaid",
      created_at: new Date(),
    });

    return {
      teamOneId,
      teamTwoId,
      registrationOneId,
      registrationTwoId,
    };
  };

  const cleanupScheduleFixture = async (fixture) => {
    if (!fixture) {
      return;
    }

    await knex("Team")
      .whereIn("id", [fixture.teamOneId, fixture.teamTwoId])
      .del();
  };

  afterAll(async () => {
    // Clean up the database after tests
    try {
      if (testUserObject.id) {
        await knex("User").where({ id: testUserObject.id }).del();
        // console.log("Test user deleted:", testUserObject.id);
      }
      if (otherUserObject?.id) {
        await knex("User").where({ id: otherUserObject.id }).del();
      }
      if (testTeamId) {
        await knex("Team").where({ id: testTeamId }).del();
      }
      if (testTournamentId) {
        await knex("Tournament").where({ id: testTournamentId }).del();
      }
      if (statusTournamentUpcomingId) {
        await knex("Tournament").where({ id: statusTournamentUpcomingId }).del();
      }
      if (statusTournamentInProgressId) {
        await knex("Tournament").where({ id: statusTournamentInProgressId }).del();
      }
      if (statusTournamentCompletedId) {
        await knex("Tournament").where({ id: statusTournamentCompletedId }).del();
      }
      if (cascadeDeleteTournamentId) {
        await knex("Tournament").where({ id: cascadeDeleteTournamentId }).del();
      }
    } catch (error) {
      console.error("Error in afterAll:", error.message);
      throw error;
    }
    stopServer(); // Explicitly stop the server
    await knex.destroy(); // Close the database connection
  });

  test("POST /api/tournaments should create a tournament", async () => {
    const startDate = dateWithOffset(7);
    const endDate = dateWithOffset(8);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Test Tournament",
        city: "Round Rock",
        state_province: "TX",
        zip_code: "78664",
        country: "USA",
        timezone: "America/New_York",
        status: "upcoming",
        format: "college",
        start_date: startDate,
        end_date: endDate,
        max_teams: 24,
        director_id: 999999,
      });

    deleteTestTournamentId = res.body.id;

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.director_id).toBe(testUserObject.id);
    // console.log("Tournament created successfully:", res.body);
  });

  test("POST /api/tournaments should fail when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Incomplete Tournament",
        format: "college",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("Missing required fields");
  });

  test("POST /api/tournaments should reject invalid max_teams", async () => {
    const startDate = dateWithOffset(7);
    const endDate = dateWithOffset(8);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Invalid Max Tournament",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        format: "classic",
        start_date: startDate,
        end_date: endDate,
        max_teams: 0,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("max_teams must be a positive integer");
  });

  test("POST /api/tournaments should reject end_date before start_date", async () => {
    const startDate = dateWithOffset(7);
    const endDate = dateWithOffset(6);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Invalid Dates Tournament",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        format: "classic",
        start_date: startDate,
        end_date: endDate,
        max_teams: 12,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("end_date must be on or after start_date");
  });

  test("POST /api/tournaments should reject start_date before today", async () => {
    const startDate = dateWithOffset(-1);
    const endDate = dateWithOffset(1);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Past Start Tournament",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        format: "classic",
        start_date: startDate,
        end_date: endDate,
        max_teams: 16,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("start_date must be today or a future date");
  });

  test("POST /api/tournaments should reject profanity in tournament text fields", async () => {
    const startDate = dateWithOffset(7);
    const endDate = dateWithOffset(8);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "shit tournament",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        format: "classic",
        start_date: startDate,
        end_date: endDate,
        max_teams: 8,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("contains disallowed profanity");
  });

  test("POST /api/tournaments should reject suspicious SQL-like payloads", async () => {
    const startDate = dateWithOffset(7);
    const endDate = dateWithOffset(8);

    const res = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "My Event'; DROP TABLE Tournament; --",
        city: "Austin",
        state_province: "TX",
        zip_code: "78701",
        country: "USA",
        format: "classic",
        start_date: startDate,
        end_date: endDate,
        max_teams: 8,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain("contains suspicious input");
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
    const updatedStartDate = dateWithOffset(10);
    const updatedEndDate = dateWithOffset(12);

    const res = await request(app)
      .put(`/api/tournaments/${testTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        name: "Updated Tournament Name",
        city: "San Diego",
        state_province: "CA",
        zip_code: "92101",
        country: "USA",
        format: "college",
        start_date: updatedStartDate,
        end_date: updatedEndDate,
        max_teams: 40,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Tournament Name");
    expect(res.body.city).toBe("San Diego");
    expect(res.body.state_province).toBe("CA");
    expect(res.body.zip_code).toBe("92101");
    expect(res.body.country).toBe("USA");
    expect(res.body.format).toBe("college");
    expect(res.body.max_teams).toBe(40);
    expect(res.body.status).toBe("upcoming");
  });

  test("GET /api/tournaments/:id should auto-sync and persist tournament status", async () => {
    const [upcomingId] = await knex("Tournament").insert({
      name: "Status Upcoming Tournament",
      city: "Austin",
      state_province: "TX",
      zip_code: "78701",
      country: "USA",
      timezone: "UTC",
      status: "completed",
      format: "classic",
      start_date: dateTimeWithOffset(4),
      end_date: dateTimeWithOffset(5),
      max_teams: 8,
      director_id: testUserObject.id,
    });
    statusTournamentUpcomingId = upcomingId;

    const [inProgressId] = await knex("Tournament").insert({
      name: "Status In Progress Tournament",
      city: "Austin",
      state_province: "TX",
      zip_code: "78701",
      country: "USA",
      timezone: "UTC",
      status: "upcoming",
      format: "classic",
      start_date: dateTimeWithOffset(-1),
      end_date: dateTimeWithOffset(1),
      max_teams: 8,
      director_id: testUserObject.id,
    });
    statusTournamentInProgressId = inProgressId;

    const [completedId] = await knex("Tournament").insert({
      name: "Status Completed Tournament",
      city: "Austin",
      state_province: "TX",
      zip_code: "78701",
      country: "USA",
      timezone: "UTC",
      status: "upcoming",
      format: "classic",
      start_date: dateTimeWithOffset(-5),
      end_date: dateTimeWithOffset(-3),
      max_teams: 8,
      director_id: testUserObject.id,
    });
    statusTournamentCompletedId = completedId;

    const [upcomingRes, inProgressRes, completedRes] = await Promise.all([
      request(app)
        .get(`/api/tournaments/${statusTournamentUpcomingId}`)
        .set("Authorization", `Bearer ${testUserObject.token}`),
      request(app)
        .get(`/api/tournaments/${statusTournamentInProgressId}`)
        .set("Authorization", `Bearer ${testUserObject.token}`),
      request(app)
        .get(`/api/tournaments/${statusTournamentCompletedId}`)
        .set("Authorization", `Bearer ${testUserObject.token}`),
    ]);

    expect(upcomingRes.statusCode).toBe(200);
    expect(upcomingRes.body.status).toBe("upcoming");
    expect(inProgressRes.statusCode).toBe(200);
    expect(inProgressRes.body.status).toBe("in_progress");
    expect(completedRes.statusCode).toBe(200);
    expect(completedRes.body.status).toBe("completed");

    const persistedUpcoming = await knex("Tournament")
      .where({ id: statusTournamentUpcomingId })
      .first();
    const persistedInProgress = await knex("Tournament")
      .where({ id: statusTournamentInProgressId })
      .first();
    const persistedCompleted = await knex("Tournament")
      .where({ id: statusTournamentCompletedId })
      .first();

    expect(persistedUpcoming.status).toBe("upcoming");
    expect(persistedInProgress.status).toBe("in_progress");
    expect(persistedCompleted.status).toBe("completed");
  });

  test("DELETE /api/tournaments/:id should cascade delete divisions and registrations", async () => {
    const [tournamentId] = await knex("Tournament").insert({
      name: "Cascade Delete Tournament",
      city: "Seattle",
      state_province: "WA",
      zip_code: "98101",
      country: "USA",
      timezone: "UTC",
      status: "upcoming",
      format: "classic",
      start_date: dateTimeWithOffset(8),
      end_date: dateTimeWithOffset(10),
      max_teams: 16,
      director_id: testUserObject.id,
    });
    cascadeDeleteTournamentId = tournamentId;

    const [divisionId] = await knex("TournamentDivision").insert({
      division_id: 1,
      tournament_id: cascadeDeleteTournamentId,
      registration_fee: 50,
      created_at: new Date(),
    });
    cascadeDeleteDivisionId = divisionId;

    await knex("Registration").insert({
      team_id: testTeamId,
      tournament_division_id: cascadeDeleteDivisionId,
      status: "registered",
      payment_status: "unpaid",
      created_at: new Date(),
    });

    await knex("TournamentUser").insert({
      user_id: testUserObject.id,
      tournament_id: cascadeDeleteTournamentId,
      created_at: new Date(),
    });

    const deleteRes = await request(app)
      .delete(`/api/tournaments/${cascadeDeleteTournamentId}`)
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(deleteRes.statusCode).toBe(200);

    const [tournamentRow, divisionRow, registrationRow, tournamentUserRow] =
      await Promise.all([
        knex("Tournament").where({ id: cascadeDeleteTournamentId }).first(),
        knex("TournamentDivision").where({ id: cascadeDeleteDivisionId }).first(),
        knex("Registration")
          .where({ tournament_division_id: cascadeDeleteDivisionId })
          .first(),
        knex("TournamentUser")
          .where({
            user_id: testUserObject.id,
            tournament_id: cascadeDeleteTournamentId,
          })
          .first(),
      ]);

    expect(tournamentRow).toBeUndefined();
    expect(divisionRow).toBeUndefined();
    expect(registrationRow).toBeUndefined();
    expect(tournamentUserRow).toBeUndefined();
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
    expect(checkRes.body.code).toBe("NotFoundError");
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
        tournament_id: testTournamentId,
      })
      .first();
    expect(tournamentUser).not.toBeNull();
    expect(tournamentUser.tournament_id).toBe(testTournamentId);
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

  test("GET /api/users/:id/tournaments should return tournaments a user is registered for", async () => {
    const tournamentUsers = await knex("TournamentUser").select("*");
    // console.log("TournamentUser table state:", tournamentUsers);

    // Fetch tournaments for the test user
    const res = await request(app)
      .get(`/api/users/${testUserObject.id}/tournaments`)
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((t) => t.id === testTournamentId)).toBe(true);
  });

  test("DELETE /api/tournaments/:id/unregister should unregister a team from a tournament", async () => {
    // Unregister the team
    const res = await request(app)
      .delete(`/api/tournaments/${testTournamentId}/unregister`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(
      "Successfully unregistered from the tournament"
    );

    // Verify the registration no longer exists
    const registration = await knex("Registration")
      .where({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      })
      .first();
    // console.log("Registration after deletion:", registration);
    expect(registration).toBeUndefined();

    // Verify the user is removed from the TournamentUser table if no other registrations exist
    const tournamentUser = await knex("TournamentUser")
      .where({
        user_id: testUserObject.id,
        tournament_id: testTournamentId,
      })
      .first();
    expect(tournamentUser).toBeUndefined();
  });

  test("POST /api/tournaments/:id/register should prevent duplicate registrations", async () => {
    // First registration
    const firstRes = await request(app)
      .post(`/api/tournaments/${testTournamentId}/register`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      });

    expect(firstRes.statusCode).toBe(201); // Ensure the first registration succeeds

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

    // Duplicate registration
    const duplicateRes = await request(app)
      .post(`/api/tournaments/${testTournamentId}/register`)
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      });

    expect(duplicateRes.statusCode).toBe(400); // Ensure the duplicate registration is blocked
    expect(duplicateRes.body.message).toBe(
      "Team is already registered for this tournament division"
    );
  });

  test("GET /api/tournaments/:id/details should return tournament details payload for directors", async () => {
    const fixture = await createScheduleFixture();
    try {
      const scheduleRes = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "13:00",
          location: "Court A",
        });
      expect(scheduleRes.statusCode).toBe(201);

      const response = await request(app)
        .get(`/api/tournaments/${testTournamentId}/details`)
        .set("Authorization", `Bearer ${testUserObject.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("tournament");
      expect(response.body).toHaveProperty("divisions");
      expect(response.body).toHaveProperty("registrations");
      expect(response.body).toHaveProperty("schedule");
      expect(Array.isArray(response.body.divisions)).toBe(true);
      expect(Array.isArray(response.body.registrations)).toBe(true);
      expect(Array.isArray(response.body.schedule)).toBe(true);
      expect(
        response.body.schedule.some((series) => series.id === scheduleRes.body.id)
      ).toBe(true);
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("GET /api/tournaments/:id/details should require authentication", async () => {
    const response = await request(app).get(
      `/api/tournaments/${testTournamentId}/details`
    );

    expect(response.statusCode).toBe(401);
  });

  test("GET /api/tournaments/:id/details should reject non-directors", async () => {
    const response = await request(app)
      .get(`/api/tournaments/${testTournamentId}/details`)
      .set("Authorization", `Bearer ${otherUserObject.token}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toContain("not authorized");
  });

  test("GET /api/tournaments/:id/matches/candidates should return registration candidates", async () => {
    const fixture = await createScheduleFixture();
    try {
      const response = await request(app)
        .get(`/api/tournaments/${testTournamentId}/matches/candidates`)
        .set("Authorization", `Bearer ${testUserObject.token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(
        response.body.some(
          (candidate) => candidate.registration_id === fixture.registrationOneId
        )
      ).toBe(true);
      expect(
        response.body.some(
          (candidate) => candidate.registration_id === fixture.registrationTwoId
        )
      ).toBe(true);
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("POST /api/tournaments/:id/matches should create a scheduled match", async () => {
    const fixture = await createScheduleFixture();
    try {
      const scheduleResponse = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "14:30",
          location: "Court 1",
        });

      expect(scheduleResponse.statusCode).toBe(201);
      expect(scheduleResponse.body).toHaveProperty("id");
      expect(scheduleResponse.body.registration1_id).toBe(
        fixture.registrationOneId
      );
      expect(scheduleResponse.body.registration2_id).toBe(
        fixture.registrationTwoId
      );
      expect(scheduleResponse.body.location).toBe("Court 1");

      const listResponse = await request(app)
        .get(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`);

      expect(listResponse.statusCode).toBe(200);
      expect(Array.isArray(listResponse.body)).toBe(true);
      expect(
        listResponse.body.some((match) => match.id === scheduleResponse.body.id)
      ).toBe(true);
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("POST /api/tournaments/:id/matches should reject identical registrations", async () => {
    const fixture = await createScheduleFixture();
    try {
      const response = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationOneId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "10:00",
          location: "Court 2",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("must be different teams");
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("POST /api/tournaments/:id/matches should reject missing required fields", async () => {
    const fixture = await createScheduleFixture();
    try {
      const response = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "10:00",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("location are required");
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("POST /api/tournaments/:id/matches should reject invalid date/time format", async () => {
    const fixture = await createScheduleFixture();
    try {
      const response = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: "2026/01/01",
          scheduled_time: "10:00",
          location: "Court 9",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain("scheduled_date must be in YYYY-MM-DD format");
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("POST /api/tournaments/:id/matches should reject non-active registrations", async () => {
    const fixture = await createScheduleFixture({
      registrationOneStatus: "withdrawn",
    });
    try {
      const response = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "11:00",
          location: "Court 6",
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toContain("not active");
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("GET /api/tournaments/:id/matches should support filtering by date", async () => {
    const fixture = await createScheduleFixture();
    try {
      const dateOne = dateWithOffset(3);
      const dateTwo = dateWithOffset(4);

      const firstSchedule = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateOne,
          scheduled_time: "09:00",
          location: "Court Date One",
        });
      expect(firstSchedule.statusCode).toBe(201);

      const secondSchedule = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateTwo,
          scheduled_time: "09:30",
          location: "Court Date Two",
        });
      expect(secondSchedule.statusCode).toBe(201);

      const filteredResponse = await request(app)
        .get(`/api/tournaments/${testTournamentId}/matches?date=${dateOne}`)
        .set("Authorization", `Bearer ${testUserObject.token}`);

      expect(filteredResponse.statusCode).toBe(200);
      expect(
        filteredResponse.body.some((match) => match.id === firstSchedule.body.id)
      ).toBe(true);
      expect(
        filteredResponse.body.some((match) => match.id === secondSchedule.body.id)
      ).toBe(false);
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("GET /api/tournaments/:id/my-match-alerts should return scheduled alerts for team members", async () => {
    const fixture = await createScheduleFixture({
      teamOneUserIds: [testUserObject.id],
      teamTwoUserIds: [],
    });
    try {
      const scheduleResponse = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "12:15",
          location: "Court Alert",
        });
      expect(scheduleResponse.statusCode).toBe(201);

      const alertsResponse = await request(app)
        .get(`/api/tournaments/${testTournamentId}/my-match-alerts`)
        .set("Authorization", `Bearer ${testUserObject.token}`);

      expect(alertsResponse.statusCode).toBe(200);
      expect(Array.isArray(alertsResponse.body)).toBe(true);
      expect(alertsResponse.body.length).toBeGreaterThan(0);
      expect(alertsResponse.body[0]).toHaveProperty("user_team_name");
      expect(alertsResponse.body[0]).toHaveProperty("opponent_team_name");
      expect(alertsResponse.body[0]).toHaveProperty("match_label");
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("GET /api/tournaments/:id/my-match-alerts should return empty for unrelated users", async () => {
    const fixture = await createScheduleFixture({
      teamOneUserIds: [testUserObject.id],
      teamTwoUserIds: [testUserObject.id],
    });
    try {
      const scheduleResponse = await request(app)
        .post(`/api/tournaments/${testTournamentId}/matches`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({
          registration1_id: fixture.registrationOneId,
          registration2_id: fixture.registrationTwoId,
          scheduled_date: dateWithOffset(2),
          scheduled_time: "16:00",
          location: "Court Unrelated",
        });
      expect(scheduleResponse.statusCode).toBe(201);

      const alertsResponse = await request(app)
        .get(`/api/tournaments/${testTournamentId}/my-match-alerts`)
        .set("Authorization", `Bearer ${otherUserObject.token}`);

      expect(alertsResponse.statusCode).toBe(200);
      expect(alertsResponse.body).toEqual([]);
    } finally {
      await cleanupScheduleFixture(fixture);
    }
  });

  test("GET /api/tournaments/:id/teams should return 404 for a non-existent tournament", async () => {
    const res = await request(app)
      .get("/api/tournaments/999999/teams") // Non-existent tournament ID
      .set("Authorization", `Bearer ${testUserObject.token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tournament not found");
    expect(res.body.code).toBe("NotFoundError");
  });

  test("POST /api/tournaments/:id/register should return 404 for a non-existent tournament", async () => {
    const res = await request(app)
      .post("/api/tournaments/999999/register") // Non-existent tournament ID
      .set("Authorization", `Bearer ${testUserObject.token}`)
      .send({
        team_id: testTeamId,
        tournament_division_id: tournamentDivisionId,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Tournament not found");
    expect(res.body.code).toBe("NotFoundError");
  });
});
