const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { setupTestUser, setupTestTeam } = require("./testUtils.js");

describe("UserTeam Controller API tests", () => {
    let testUserAuthToken;
    let testUserId;
    let testTeamId;
    let testUserTeamId;

    let server;
    
    beforeAll(async () => {
        server = startServer(); // Explicitly start the server

        try {
            const { id, token } = await setupTestUser();
            testUserId = id;
            testUserAuthToken = token;
            console.log("Test user created:", { testUserId, testUserAuthToken });

            const testTeam = await setupTestTeam(testUserAuthToken);
            testTeamId = testTeam.id;
            console.log("Test team created:", { testTeamId });
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
            if(testTeamId) {
                await knex("Team").where({ id: testTeamId }).del();
                console.log("Test team deleted:", testTeamId);
            }
        } catch (error) {
            console.error("Error in afterAll:", error.message);
            throw error;
        }
        stopServer(); // Explicitly stop the server
        await knex.destroy(); // Close the database connection
    });

    test("GET /api/userTeams should return empty array when there are no userTeams", async () => {
        const response = await request(app)
            .get("/api/userTeams")
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        console.log("UserTeams:", response.body);
        expect(response.body.length).toBe(0);
    });

    test("POST /api/userTeams should create a new userTeam", async () => {
        const response = await request(app)
            .post("/api/userTeams")
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({
                user_id: testUserId,
                team_id: testTeamId,
                status: "invited",
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        testUserTeamId = response.body.id;
        console.log("Test userTeam created:", testUserTeamId);
    });

    test("GET /api/userTeams should return all userTeams", async () => {
        const response = await request(app)
            .get("/api/userTeams")
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some((userTeam) => userTeam.id === testUserTeamId)).toBe(true);
    });

    test("GET /api/userTeams/:id should return the userTeam with the specified id", async () => {
        const response = await request(app)
            .get(`/api/userTeams/${testUserTeamId}`)
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testUserTeamId);
    });

    test("PUT /api/userTeams/:id should return 400 when not all fields present", async () => {
        const response = await request(app)
            .put(`/api/userTeams/${testUserTeamId}`)
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({ status: "accepted" });
        
        expect(response.status).toBe(400);
    });

    test("PUT /api/userTeams/:id should update the userTeam with the specified id", async () => {
        const response = await request(app)
            .put(`/api/userTeams/${testUserTeamId}`)
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({ user_id: testUserId, team_id: testTeamId, status: "accepted" });
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("accepted");
    });

    test("DELETE /api/userTeams/:id should return 404 when team with specified ID not found", async () => {
        const response = await request(app)
            .delete("/api/userTeams/999999")
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(404);
    });

    test("GET /api/userTeams/:id returns 404 if the userTeam does not exist", async () => {
        const response = await request(app)
            .get("/api/userTeams/999999")
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(404);
    });

    test("DELETE /api/userTeams/:id returns 404 if the userTeam does not exist", async () => {
        const response = await request(app)
            .delete("/api/userTeams/999999")
            .set("Authorization", `Bearer ${testUserAuthToken}`);
        expect(response.status).toBe(404);
    });

    test("POST /api/userTeams returns 400 if the request body is invalid", async () => {
        const response = await request(app)
            .post("/api/userTeams")
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({
                user_id: testUserId,
                team_id: testTeamId,
                status: "invalidStatus",
            });
        expect(response.status).toBe(400);
    });

    test("POST /api/userTeams return 404 if user not found", async () => {
        const response = await request(app)
            .post("/api/userTeams") 
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({
                user_id: 999999,
                team_id: testTeamId,
                status: "invited",
            });
        expect(response.status).toBe(404);
    });

    test("POST /api/userTeams return 404 if team not found", async () => {
        const response = await request(app)
            .post("/api/userTeams") 
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({
                user_id: testUserId,
                team_id: 999999,
                status: "invited",
            });
        expect(response.status).toBe(404);
    });

    test("PUT /api/userTeams/:id returns 404 if the userTeam does not exist", async () => {
        const response = await request(app)
            .put("/api/userTeams/999999")
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({ user_id: testUserId, team_id: testTeamId, status: "accepted" });
        expect(response.status).toBe(404);
    });

    test("PUT /api/userTeams/:id returns 400 if the request body is invalid", async () => {
        const response = await request(app)
            .put(`/api/userTeams/${testUserTeamId}`)
            .set("Authorization", `Bearer ${testUserAuthToken}`)
            .send({ user_id: testUserId, team_id: testTeamId, status: "invalidStatus" });
        expect(response.status).toBe(400);
    });

    
});
