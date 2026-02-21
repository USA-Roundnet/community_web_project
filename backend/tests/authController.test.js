const request = require("supertest");
const jwt = require("jsonwebtoken");
const { app, startServer, stopServer } = require("../index");
const db = require("../knex-config");
const { registerUser, loginUser } = require("./testUtils");

let server;
const createdUserIds = new Set();

beforeAll((done) => {
  server = startServer(); // Explicitly start the server
  done();
});

afterEach(() => {
  if (global.fetch?.mockRestore) {
    global.fetch.mockRestore();
  }
});

afterAll(async () => {
  for (const userId of createdUserIds) {
    await db("User").where({ id: userId }).del();
  }
  await new Promise((resolve) => stopServer(resolve));
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
    createdUserIds.add(user.id);
  });

  test("POST /api/auth/login should log in a user and return a token", async () => {
    authToken = await loginUser("testuser@example.com", "testpassword123");
    expect(authToken).toBeDefined();
  });

  test("GET /api/auth/google should redirect to Google OAuth", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_REDIRECT_URI =
      "http://localhost:5000/api/auth/google/callback";

    const res = await request(app).get("/api/auth/google");

    expect(res.statusCode).toBe(302);
    const redirectUrl = new URL(res.headers.location);
    expect(redirectUrl.origin + redirectUrl.pathname).toBe(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );
    expect(redirectUrl.searchParams.get("client_id")).toBe("google-client-id");
    expect(redirectUrl.searchParams.get("redirect_uri")).toBe(
      "http://localhost:5000/api/auth/google/callback"
    );
    expect(redirectUrl.searchParams.get("scope")).toBe("openid email profile");
  });

  test("GET /api/auth/google/callback should create a Google user and redirect with JWT", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";
    process.env.GOOGLE_REDIRECT_URI =
      "http://localhost:5000/api/auth/google/callback";
    process.env.FRONTEND_URL = "http://localhost:5173";

    const unique = Date.now();
    const googleEmail = `google_user_${unique}@example.com`;
    const googleSub = `google-sub-${unique}`;

    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "google-access-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sub: googleSub,
          email: googleEmail,
          name: "Google OAuth User",
          given_name: "Google",
          family_name: "User",
        }),
      });

    const res = await request(app)
      .get("/api/auth/google/callback")
      .query({ code: "google-code" });

    expect(res.statusCode).toBe(302);
    const redirectUrl = new URL(res.headers.location);
    expect(redirectUrl.origin + redirectUrl.pathname).toBe(
      "http://localhost:5173/login"
    );

    const token = redirectUrl.searchParams.get("token");
    expect(token).toBeTruthy();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const dbUser = await db("User").where({ id: decoded.id }).first();
    createdUserIds.add(dbUser.id);

    expect(dbUser).toBeTruthy();
    expect(dbUser.email).toBe(googleEmail);
    expect(dbUser.google_id).toBe(googleSub);
    expect(dbUser.auth_provider).toBe("google");
    expect(dbUser.name).toBe("Google OAuth User");
  });

  test("GET /api/auth/google/callback should link an existing account by email", async () => {
    process.env.GOOGLE_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-client-secret";
    process.env.GOOGLE_REDIRECT_URI =
      "http://localhost:5000/api/auth/google/callback";
    process.env.FRONTEND_URL = "http://localhost:5173";

    const unique = Date.now();
    const existingUser = await registerUser({
      first_name: "Existing",
      last_name: "LocalUser",
      username: `existing_local_${unique}`,
      email: `existing_local_${unique}@example.com`,
      password: "testpassword123",
      gender: "male",
      city: "Test City",
      state_province: "Test State",
      zip_code: "12345",
      country: "Test Country",
      phone_number: "123-456-7890",
      date_of_birth: "1990-01-01",
    });
    createdUserIds.add(existingUser.id);

    const googleSub = `existing-google-sub-${unique}`;
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: "google-access-token" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sub: googleSub,
          email: existingUser.email,
          name: "Existing Linked User",
          given_name: "Existing",
          family_name: "LinkedUser",
        }),
      });

    const res = await request(app)
      .get("/api/auth/google/callback")
      .query({ code: "google-code" });

    expect(res.statusCode).toBe(302);
    const redirectUrl = new URL(res.headers.location);
    const token = redirectUrl.searchParams.get("token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.id).toBe(existingUser.id);

    const linkedUser = await db("User").where({ id: existingUser.id }).first();
    expect(linkedUser.google_id).toBe(googleSub);
    expect(linkedUser.auth_provider).toBe("google");
    expect(linkedUser.name).toBe("Existing Linked User");
  });
});
