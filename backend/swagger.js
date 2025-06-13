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
  paths: {
    "/users": {
      get: {
        summary: "Get all users",
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  first_name: { type: "string", example: "Johny" },
                  last_name: { type: "string", example: "Doe" },
                  username: { type: "string", example: "johndoe"},
                  gender: { type: "enum", example: "male" },
                  email: { type: "string", example: "john.doe@example.com" },
                  city: { type: "string", example: "City"},
                  state_province: { type: "string", example: "State"},
                  zip_code: { type: "string", example: "Zip"},
                  country: { type: "string", example: "Country"},
                  phone_number: { type: "string", example: "9999999999"},
                  date_of_birth: { type: "date", example: "2000-01-01"},
                  profile_picture_url: { type: "string", example: "https://example.com/john.jpg"},
                  password: { type: "string", exmaple: "password"},
                  auth_provider: { type: "enum", example:"local" },
                  google_id: { type: "string", example: "googleid"},
                  created_at: { type: "timestamp", example: "2000-02-02 00:00:00"},
                  elo: { type: "integer", example: 1000},
                  rank: { type: "integer", example: 80},
                  status: { type: "enum", example: "bronze"},
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new user",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                  first_name: { type: "string", example: "Johny" },
                  last_name: { type: "string", example: "Doe" },
                  username: { type: "string", example: "johndoe"},
                  gender: { type: "enum", example: "male" },
                  email: { type: "string", example: "john.doe@example.com" },
                  city: { type: "string", example: "City"},
                  state_province: { type: "string", example: "State"},
                  zip_code: { type: "string", example: "Zip"},
                  country: { type: "string", example: "Country"},
                  phone_number: { type: "string", example: "9999999999"},
                  date_of_birth: { type: "date", example: "2000-01-01"},
                  profile_picture_url: { type: "string", example: "https://example.com/john.jpg"},
                  password: { type: "string", exmaple: "password"},
                  auth_provider: { type: "enum", example:"local" },
                  google_id: { type: "string", example: "googleid"},
                  created_at: { type: "timestamp", example: "2000-02-02 00:00:00"},
                  elo: { type: "integer", example: 1000},
                  rank: { type: "integer", example: 80},
                  status: { type: "enum", example: "bronze"},
              },
            },
          },
        ],
        responses: {
          201: { description: "User created successfully" },
        },
      },
    },
    "/users/{id}": {
      get: {
        summary: "Get user by ID",
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "Successful response" },
          404: { description: "User not found" },
        },
      },
      put: {
        summary: "Update a user by ID",
        parameters: [
          { in: "path", name: "id", required: true, type: "integer" },
          { 
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: { type: "integer", example: 1 },
                  first_name: { type: "string", example: "Johny" },
                  last_name: { type: "string", example: "Doe" },
                  username: { type: "string", example: "johndoe"},
                  gender: { type: "enum", example: "male" },
                  email: { type: "string", example: "john.doe@example.com" },
                  city: { type: "string", example: "City"},
                  state_province: { type: "string", example: "State"},
                  zip_code: { type: "string", example: "Zip"},
                  country: { type: "string", example: "Country"},
                  phone_number: { type: "string", example: "9999999999"},
                  date_of_birth: { type: "date", example: "2000-01-01"},
                  profile_picture_url: { type: "string", example: "https://example.com/john.jpg"},
                  password: { type: "string", exmaple: "password"},
                  auth_provider: { type: "enum", example:"local" },
                  google_id: { type: "string", example: "googleid"},
                  created_at: { type: "timestamp", example: "2000-02-02 00:00:00"},
                  elo: { type: "integer", example: 1000},
                  rank: { type: "integer", example: 80},
                  status: { type: "enum", example: "bronze"},
              },
            },
          },
        ],
        responses: {
          200: { description: "User updated successfully" },
          404: { description: "User not found" },
        },
      },
      delete: {
        summary: "Delete a user by ID",
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "User deleted successfully" },
          404: { description: "User not found" },
        },
      },
    },
    "/organizations": {
      get: {
        summary: "Get all organizations",
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Org Name" },
                  email: { type: "string", example: "org@example.com" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new organization",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Org Name" },
                email: { type: "string", example: "org@example.com" },
              },
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
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Organization not found" },
        },
      },
      put: {
        summary: "Update an organization by ID",
        parameters: [
          { in: "path", name: "id", required: true, type: "integer" },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Updated Org" },
                email: { type: "string", example: "updatedorg@example.com" },
              },
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
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "Organization deleted successfully" },
          404: { description: "Organization not found" },
        },
      },
    },
    "/tournaments": {
      get: {
        summary: "Get all tournaments",
        responses: {
          200: {
            description: "Successful response",
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Tournament Name" },
                  status: { type: "string", example: "upcoming" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new tournament",
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Tournament Name" },
                status: { type: "string", example: "upcoming" },
              },
            },
          },
        ],
        responses: {
          201: { description: "Tournament created successfully" },
        },
      },
    },
    "/tournaments/{id}": {
      get: {
        summary: "Get tournament by ID",
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "Successful response" },
          404: { description: "Tournament not found" },
        },
      },
      put: {
        summary: "Update a tournament by ID",
        parameters: [
          { in: "path", name: "id", required: true, type: "integer" },
          {
            in: "body",
            name: "body",
            required: true,
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Updated Tournament" },
                status: { type: "string", example: "in_progress" },
              },
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
        parameters: [{ in: "path", name: "id", required: true, type: "integer" }],
        responses: {
          200: { description: "Tournament deleted successfully" },
          404: { description: "Tournament not found" },
        },
      },
    },
  },
};