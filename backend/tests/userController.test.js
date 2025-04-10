const request = require("supertest");
const { app, startServer, stopServer } = require("../index");
const knex = require("../knex-config.js");
const { registerUser, loginUser, setupTestUser } = require("./testUtils.js");

describe("User Controller API Tests", () => {
  let testUserObject;

  let server;

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
    server = startServer(); // Explicitly start the server

    // Use the global setupTestUser to register and log in a test user
    try {
      testUserObject = await setupTestUser();
      // const testUserId = testUserObject.id;
      // const testUserToken = testUserObject.token;
      // console.log("Test user created:", { testUserId, testUserToken });
    } catch (error) {
      console.error("Error in beforeAll:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (testUserObject.id) {
        await knex("User").where({ id: testUserObject.id }).del();
        // console.log("Test user deleted:", testUserObject.id);
      }
    } catch (error) {
      console.error("Error in afterAll:", error.message);
      throw error;
    }
    stopServer(); // Explicitly stop the server
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

    test("Create a user with missing required fields", async () => {
      const response = await request(app).post("/api/users").send({
        first_name: "MissingFields",
        last_name: "User",
        // Missing email and password
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Email is required");
    });

    test("Create a user with invalid email", async () => {
      const response = await request(app).post("/api/users").send({
        first_name: "InvalidInput",
        last_name: "User",
        email: "invalid-email", // Invalid email format
        password: "testpassword",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid email format");
    });

    test("Create a user with invalid phone number", async () => {
      const response = await request(app).post("/api/users").send({
        first_name: "InvalidOptional",
        last_name: "User",
        email: "validemail@example.com",
        phone_number: "invalid-phone", // Invalid phone number
        password: "testpassword",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid phone number");
    });

    test("Create a user with invalid date of birth", async () => {
      const response = await request(app).post("/api/users").send({
        first_name: "InvalidOptional",
        last_name: "User",
        email: "validemail@example.com",
        date_of_birth: "not-a-date", // Invalid date format
        password: "testpassword",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Invalid date of birth");
    });

    test("Create a user with duplicate email or username", async () => {
      // First user creation
      await request(app).post("/api/users").send(newUser);

      // Attempt to create another user with the same email and username
      const response = await request(app).post("/api/users").send(newUser);
      expect(response.status).toBe(409);
      expect(response.body.message).toContain(
        "Email or username already exists"
      );
    });
  });

  describe("Tests logging in of user", () => {
    test("Login with valid credentials", async () => {
      // console.log("testUserObject: ", testUserObject);
      const response = await request(app).post("/api/auth/login").send({
        email: testUserObject.email,
        password: testUserObject.password,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    test("Login with invalid username", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "wrongemail", password: testUserObject.password });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });

    test("Login with invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: testUserObject.email, password: "wrongpassword" });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid email or password");
    });
  });

  describe("Tests update of user", () => {
    test("Update a user property by id", async () => {
      const response = await request(app)
        .put(`/api/users/${testUserObject.id}`)
        .set("Authorization", `Bearer ${testUserObject.token}`)
        .send({ first_name: "newfirst_name" });
      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe("newfirst_name");
    });
  });

  describe("Tests auth creation and handling", () => {
    test("Verify two JWTs created at different timestamps are not the same", async () => {
      // Log in twice with a delay
      const token1 = await loginUser(
        testUserObject.email,
        testUserObject.password
      );
      // console.log("created: " + token1);

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

      const token2 = await loginUser(
        testUserObject.email,
        testUserObject.password
      );
      // console.log("created: " + token2);

      expect(token1).not.toEqual(token2);
    });

    test("Access protected route without auth token", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  });

  describe("Tests fetching a non-existent user", () => {
    test("Fetch a user that does not exist", async () => {
      const response = await request(app)
        .get("/api/users/999999") // Non-existent user ID
        .set("Authorization", `Bearer ${testUserObject.token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
