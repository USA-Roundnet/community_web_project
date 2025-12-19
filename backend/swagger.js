module.exports = {
  swagger: "2.0",
  info: {
    title: "Community API",
    version: "1.0.0",
    description: "API documentation for the Community services",
  },
  host: "localhost:5000",
  basePath: "/api",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Paste: Bearer <JWT>",
    },
  },
  security: [{ bearerAuth: [] }],

  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/UserCreateRequest",
            },
          },
        ],
        responses: {
          201: {
            description: "User registered successfully",
            schema: {
              $ref: "#/definitions/UserResponse",
            },
          },
          409: {
            description: "Email or username already exists",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
          500: {
            description: "Registration failed",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/auth/login": {
      post: {
        summary: "Log in a user",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "john.doe@example.com",
                },
                password: {
                  type: "string",
                  example: "password123",
                },
              },
              required: ["email", "password"],
            },
          },
        ],
        responses: {
          200: {
            description: "Login successful",
            schema: {
              type: "object",
              properties: {
                // adjust if you end up using cookies/sessions instead of JWT
                token: {
                  type: "string",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
          500: {
            description: "Login failed",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/auth/forgot-password": {
      post: {
        summary: "Request a password reset link",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "john.doe@example.com",
                },
              },
              required: ["email"],
            },
          },
        ],
        responses: {
          200: {
            description: "Password reset link sent",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example:
                    "If your email exists in our system, a password reset link has been sent",
                },
              },
            },
          },
          500: {
            description: "Request failed",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/auth/reset-password": {
      post: {
        summary: "Reset password using a token",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                token: {
                  type: "string",
                  example: "random-token-string",
                },
                password: {
                  type: "string",
                  example: "newpassword123",
                },
              },
              required: ["token", "password"],
            },
          },
        ],
        responses: {
          200: {
            description: "Password reset successful",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Password has been reset successfully",
                },
              },
            },
          },
          400: {
            description: "Invalid or expired token",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
          500: {
            description: "Reset failed",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/users": {
      get: {
        summary: "Get all users",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/UserResponse",
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new user",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/UserCreateRequest",
            },
          },
        ],
        responses: {
          201: {
            description: "User created successfully",
            schema: {
              $ref: "#/definitions/UserResponse",
            },
          },
          409: {
            description: "Email or username already exists",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/users/{id}": {
      get: {
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              $ref: "#/definitions/UserResponse",
            },
          },
          404: {
            description: "User not found",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
      put: {
        summary: "Update a user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              // reuse create request for now; can create UserUpdateRequest later
              $ref: "#/definitions/UserCreateRequest",
            },
          },
        ],
        responses: {
          200: {
            description: "User updated successfully",
            schema: {
              $ref: "#/definitions/UserResponse",
            },
          },
          404: {
            description: "User not found",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
      delete: {
        summary: "Delete a user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "User deleted successfully" },
          404: {
            description: "User not found",
            schema: {
              $ref: "#/definitions/ErrorResponse",
            },
          },
        },
      },
    },

    "/organizations": {
      get: {
        summary: "Get all organizations",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/OrganizationResponse",
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new organization",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/OrganizationCreateRequest",
            },
          },
        ],
        responses: {
          201: { description: "Organization created successfully" },
        },
      },
    },

    "/organizations/{id}": {
      get: {
        summary: "Get organization by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              $ref: "#/definitions/OrganizationResponse",
            },
          },
          404: { description: "Organization not found" },
        },
      },
      put: {
        summary: "Update an organization by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/OrganizationCreateRequest",
            },
          },
        ],
        responses: {
          200: { description: "Organization updated successfully" },
          404: { description: "Organization not found" },
        },
      },
      delete: {
        summary: "Delete an organization by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "Organization deleted successfully" },
          404: { description: "Organization not found" },
        },
      },
    },

    "/tournaments": {
      get: {
        summary: "Get all tournaments",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                $ref: "#/definitions/TournamentResponse",
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new tournament",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/TournamentCreateRequest",
            },
          },
        ],
        responses: {
          201: {
            description: "Tournament created successfully",
            schema: {
              $ref: "#/definitions/TournamentResponse",
            },
          },
        },
      },
    },

    "/tournaments/{id}": {
      get: {
        summary: "Get tournament by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: {
            description: "Successful response",
            schema: {
              $ref: "#/definitions/TournamentResponse",
            },
          },
          404: { description: "Tournament not found" },
        },
      },
      put: {
        summary: "Update a tournament by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/TournamentCreateRequest",
            },
          },
        ],
        responses: {
          200: { description: "Tournament updated successfully" },
          404: { description: "Tournament not found" },
        },
      },
      delete: {
        summary: "Delete a tournament by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "Tournament deleted successfully" },
          404: { description: "Tournament not found" },
        },
      },
    },
    "/tournaments/divisions": {
      post: {
        summary: "Create a new tournament division",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/createTournamentDivision",
            },
          },
        ],
        responses: {
          201: { description: "Tournament division created successfully" },
        },
      },
    },

    "/tournaments/{id}/register": {
      post: {
        summary: "Register a team for a tournament",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/createTournamentRegistration",
            },
          },
        ],
        responses: {
          200: { description: "Team registered successfully" },
          400: { description: "Registration failed" },
        },
      },
    }, 

    "/tournaments/{id}/unregister": {
      delete: {
        summary: "Unregister a team from a tournament",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path", 
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/createTournamentUnregistration",
            },
          },
        ],
        responses: {
          200: { description: "Team unregistered successfully" },
          400: { description: "Unregistration failed" },
        },
      },
    },

    "/teams": {
      post: {
        summary: "Create a new team",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/TeamCreateRequest",
            },
          },
        ],
        responses: {
          201: { description: "Team created successfully" },  
        },
      },
      get: {  
        summary: "Get all teams",
        parameters: [],
        responses: {    
          200: { description: "Successful response" },
        },
      },
    }, 
    "/teams/{id}": {
      get: {
        summary: "Get team by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Team not found" },
        },
      },
      put: {
        summary: "Update a team by ID",
        security: [{ bearerAuth: [] }], 
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/TeamUpdateRequest",
            },
          },
        ],
        responses: {
          200: { description: "Team updated successfully" },
          404: { description: "Team not found" },
        },
      },
      delete: {
        summary: "Delete a team by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",   
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "Team deleted successfully" },
          404: { description: "Team not found" },
        },
    },
  },
  "/userTeams": {
      get: {
        summary: "Get all user-team associations",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Successful response", 
          },
        },
      },
      post: {
        summary: "Create a new user-team association",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/UserTeamCreateRequest",
            },
          },
        ],
        responses: {
          201: { description: "User-Team association created successfully" },
        },
      },
    },
    "/userTeams/{id}": {
      get: {
        summary: "Get user-team association by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: { 
          200: { description: "Successful response" },
          404: { description: "User-Team association not found" },
        },
      },
      put: {
        summary: "Update a user-team association by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              $ref: "#/definitions/UserTeamUpdateRequest",
            },
          },
        ],
        responses: {
          200: { description: "User-Team association updated successfully" },
          404: { description: "User-Team association not found" },
        },
      },
      delete: {
        summary: "Delete a user-team association by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "integer",
          },
        ],
        responses: {
          200: { description: "User-Team association deleted successfully" },
          404: { description: "User-Team association not found" },
        },
      },
    },
    

  },

  definitions: {
    // -------- USERS --------
    UserCreateRequest: {
      type: "object",
      properties: {
        first_name: { type: "string", example: "John" },
        last_name: { type: "string", example: "Doe" },
        username: { type: "string", example: "johndoe" },
        email: {
          type: "string",
          example: "john.doe@example.com",
        },
        password: { type: "string", example: "password123" },
        gender: {
          type: "string",
          enum: ["male", "female", "other"],
          example: "male",
        },
        city: { type: "string", example: "New York" },
        state_province: { type: "string", example: "NY" },
        zip_code: { type: "string", example: "10001" },
        country: { type: "string", example: "USA" },
        phone_number: {
          type: "string",
          example: "123-456-7890",
        },
        date_of_birth: {
          type: "string",
          format: "date",
          example: "1990-01-01",
        },
        profile_picture_url: {
          type: "string",
          example: "https://example.com/profile.jpg",
        },
        auth_provider: {
          type: "string",
          enum: ["local", "google"],
          example: "local",
        },
        google_id: {
          type: "string",
          example: "google-oauth-id",
        },
      },
      required: [
        "first_name",
        "last_name",
        "username",
        "email",
        "password",
        "gender",
        "city",
        "state_province",
        "zip_code",
        "country",
        "phone_number",
        "date_of_birth",
      ],
    },

    UserResponse: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        first_name: { type: "string", example: "John" },
        last_name: { type: "string", example: "Doe" },
        username: { type: "string", example: "johndoe" },
        gender: {
          type: "string",
          enum: ["male", "female", "other"],
          example: "male",
        },
        email: {
          type: "string",
          example: "john@example.com",
        },
        city: { type: "string", example: "City 1" },
        state_province: { type: "string", example: "State 1" },
        zip_code: { type: "string", example: "12345" },
        country: { type: "string", example: "Country 1" },
        phone_number: {
          type: "string",
          example: "123-456-7890",
        },
        date_of_birth: {
          type: "string",
          format: "date",
          example: "1990-01-01",
        },
        profile_picture_url: {
          type: "string",
          example: "https://example.com/john.jpg",
        },
        auth_provider: {
          type: "string",
          enum: ["local", "google"],
          example: "local",
        },
        google_id: {
          type: "string",
          example: "google-oauth-id",
        },
        created_at: {
          type: "string",
          format: "date-time",
          example: "2025-01-01T12:00:00Z",
        },
        elo: { type: "integer", example: 1000 },
        rank: { type: "integer", example: 80 },
        status: { type: "string", example: "bronze" },
      },
      // intentionally no password field
    },

    // -------- ORGANIZATIONS --------
    OrganizationCreateRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Org Name" },
        email: { type: "string", example: "org@example.com" },
      },
      required: ["name"],
    },

    OrganizationResponse: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Org Name" },
        email: { type: "string", example: "org@example.com" },
      },
    },

    // -------- TOURNAMENTS --------
    TournamentCreateRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Tournament Name" },
        city: { type: "string", example: "Boston" },
        state_province: { type: "string", example: "MA" },
        zip_code: { type: "string", example: "02108" },
        country: { type: "string", example: "USA" },
        timezone: {
          type: "string",
          example: "America/New_York",
        },
        status: {
          type: "string",
          enum: ["upcoming", "in_progress", "completed"],
          example: "upcoming",
        },
        format: {
          type: "string",
          enum: ["asl", "college", "classic"],
          example: "classic",
        },
        phone_number: {
          type: "string",
          example: "555-555-5555",
        },
        email: {
          type: "string",
          example: "td@example.com",
        },
        start_date: {
          type: "string",
          format: "date-time",
          example: "2025-01-15T09:00:00Z",
        },
        end_date: {
          type: "string",
          format: "date-time",
          example: "2025-01-15T18:00:00Z",
        },
        max_teams: { type: "integer", example: 64 },
        registration_deadline: {
          type: "string",
          format: "date-time",
          example: "2025-01-10T23:59:59Z",
        },
      },
      required: [
        "name",
        "city",
        "state_province",
        "country",
        "timezone",
        "status",
        "format",
        "start_date",
        "end_date",
      ],
    },

    TournamentResponse: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Tournament Name" },
        city: { type: "string", example: "Boston" },
        state_province: { type: "string", example: "MA" },
        zip_code: { type: "string", example: "02108" },
        country: { type: "string", example: "USA" },
        timezone: {
          type: "string",
          example: "America/New_York",
        },
        status: {
          type: "string",
          enum: ["upcoming", "in_progress", "completed"],
          example: "upcoming",
        },
        format: {
          type: "string",
          enum: ["asl", "college", "classic"],
          example: "classic",
        },
        phone_number: {
          type: "string",
          example: "555-555-5555",
        },
        email: {
          type: "string",
          example: "td@example.com",
        },
        start_date: {
          type: "string",
          format: "date-time",
          example: "2025-01-15T09:00:00Z",
        },
        end_date: {
          type: "string",
          format: "date-time",
          example: "2025-01-15T18:00:00Z",
        },
        max_teams: { type: "integer", example: 64 },
        registration_deadline: {
          type: "string",
          format: "date-time",
          example: "2025-01-10T23:59:59Z",
        },
      },
    },

    createTournamentDivision: {
      type: "object",
      properties: {
        division_id: { type: "integer", example: 1 },
        tournament_id: { type: "integer", example: 2 },
        max_teams: { type: "integer", example: 16 },
        registration_fee: { type: "integer", example: 100 },
      },
      required: ["division_id", "tournament_id", "max_teams", "registration_fee"],
    },

    createTournamentRegistration: {
      type: "object",
      properties: {
        tournament_id: { type: "integer", example: 1 },
        user_id: { type: "integer", example: 2 },
        team_id: { type: "integer", example: 3 },
        tournament_division_id: { type: "integer", example: 4 },
      },
      required: ["tournament_id", "user_id", "team_id", "tournament_division_id"],
    },

    createTournamentUnregistration: {
      type: "object",
      properties: {
        tournament_id: { type: "integer", example: 1 },
        user_id: { type: "integer", example: 2 },
        team_id: { type: "integer", example: 3 },
        tournament_division_id: { type: "integer", example: 4 },
      },
      required: ["tournament_id", "user_id", "team_id", "tournament_division_id"],
    },
        

    // -------- TEAMS --------
    TeamCreateRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Team Name" },
        team_type_id: { type: "integer", example: 12 },
        public: { type: "boolean", example: true },
        description: {
          type: "string", example: "A brief description of the team",
        },
      },
      required: ["name", "team_type_id", "public", "description"],
    },
    
    TeamUpdateRequest: {
      type: "object",
      properties: {
        name: { type: "string", example: "Updated Team Name" },
        team_type_id: { type: "integer", example: 15 },
        public: { type: "boolean", example: false },
        description: {
          type: "string", example: "An updated brief description of the team",
        },
      },
      required: ["name", "team_type_id", "public", "description"],
    },

    // -------- USER-TEAM ASSOCIATIONS --------
    UserTeamCreateRequest: {
      type: "object",
      properties: {
        user_id: { type: "integer", example: 1 },
        team_id: { type: "integer", example: 2 },
        status: { type: "string", enum: ["invited", "accepted", "declined"], example: "invited" },
      },
      required: ["user_id", "team_id", "status"],
    },

    UserTeamUpdateRequest: {
      type: "object",
      properties: {
        user_id: { type: "integer", example: 1 },
        team_id: { type: "integer", example: 2 },
        status: { type: "string", enum: ["invited", "accepted", "declined"], example: "accepted" },
      },
      required: ["user_id", "team_id", "status"],
    },

    // -------- ERRORS --------
    ErrorResponse: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Error message",
        },
        details: {
          type: "string",
          example: "Additional error details",
        },
      },
    },
  },
};
