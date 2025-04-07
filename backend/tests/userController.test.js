const request = require("supertest");
const { app } = require("../index");
const knex = require("../knex-config.js");
const { registerUser, loginUser, setupTestUser } = require("./testUtils.js");

describe("User Controller API Tests", () => {
  let createdBaseUserId;
  let testUserId;
  let testUserAuthToken;

  const baseUser = {
    first_name: "oldfirstname",
    last_name: "oldlastname",
    username: `oldusername`,
    gender: "male",
    email: `oldemail@test.com`,
    city: "oldcity",
    state_province: "oldstate",
    zip_code: "00000",
    country: "oldcountry",
    phone_number: "9999999999",
    date_of_birth: "2000-01-01",
    profile_picture_url: "https://old.com/test.jpg",
    password: "oldpassword",
    auth_provider: "local",
    google_id: "oldgoogleid",
    created_at: "2000-02-02 00:00:00",
    elo: 1000,
    rank: 10,
    status: "pro",
  };

  const newUser = {
    first_name: "testfirstname",
    last_name: "testlastname",
    username: `testusername`,
    gender: "male",
    email: `testemail@test.com`,
    city: "testcity",
    state_province: "teststate",
    zip_code: "00000",
    country: "testcountry",
    phone_number: "9999999999",
    date_of_birth: "2000-01-01",
    profile_picture_url: "https://test.com/test.jpg",
    password: "testpassword",
    auth_provider: "local",
    google_id: "testgoogleid",
    created_at: "2000-02-02 00:00:00",
    elo: 1000,
    rank: 10,
    status: "pro",
  };

  const minimalUser = {
    first_name: "minimal",
    last_name: "user",
    username: `minimaluser`,
    gender: "male",
    email: `minimal@test.com`,
    city: "testcity",
    state_province: "teststate",
    zip_code: "00000",
    country: "testcountry",
    phone_number: "9999999999",
    date_of_birth: "2000-01-01",
  };

  beforeAll(async () => {
    // Register the base user using the registerUser utility
    const userObject = await registerUser(baseUser);
    createdBaseUserId = userObject.id; // Save the user ID for later use

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
      if (createdBaseUserId) {
        await knex("User").where({ id: createdBaseUserId }).del();
        console.log("Test user deleted:", createdBaseUserId);
      }
    } catch (error) {
      console.error("Error in afterAll:", error.message);
      throw error;
    }
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

  describe("Tests creation of new user", () => {
    test("Create a new user with all proper input", async () => {
      const response = await request(app).post("/api/users").send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    test("Create a new user with minimal proper input", async () => {
      const response = await request(app).post("/api/users").send(minimalUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  describe("Tests update of user", () => {
    test("Update a user property by id", async () => {
      const response = await request(app)
        .put(`/api/users/${createdBaseUserId}`)
        .send({ first_name: "newfirst_name" });
      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe("newfirst_name");
    });
  });

  describe("Tests JWT creation", () => {
    test("Verify two JWTs created at different timestamps are not the same", async () => {
      // Log in twice with a delay
      const token1 = await loginUser(baseUser.email, baseUser.password);
      // console.log("created: " + token1);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

      const token2 = await loginUser(baseUser.email, baseUser.password);
      // console.log("created: " + token2);

      expect(token1).not.toEqual(token2);
    });
  });

  describe("Tests fetching a non-existent user", () => {
    test("Fetch a user that does not exist", async () => {
      const response = await request(app).get("/api/users/999999"); // Non-existent user ID
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
