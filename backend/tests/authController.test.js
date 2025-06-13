const { app, startServer, stopServer } = require("../index");
const { registerUser, loginUser } = require("./testUtils");

let server;

beforeAll((done) => {
  server = startServer(); // Explicitly start the server
  done();
});

afterAll((done) => {
  stopServer(done); // Explicitly stop the server
});

describe("Auth Controller API Tests", () => {
  let authToken;

  test("POST /api/auth/register should register a new user", async () => {
    const user = await registerUser({
      first_name: "Test",
      last_name: "User",
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword123",
      gender: "male",
      city: "Test City",
      state_province: "Test State",
      zip_code: "12345",
      country: "Test Country",
      phone_number: "123-456-7890",
      date_of_birth: "1990-01-01",
    });

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("email", "testuser@example.com");
  });

  test("POST /api/auth/login should log in a user and return a token", async () => {
    authToken = await loginUser("testuser@example.com", "testpassword123");
    expect(authToken).toBeDefined();
  });
});
