module.exports = {
  swagger: "2.0",
  info: {
    title: "User API",
    version: "1.0.0",
    description: "API documentation for the User service",
  },
  host: "localhost:5000",
  basePath: "/api/users",
  schemes: ["http"],
  paths: {
    "/": {
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
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john.doe@example.com" },
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
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john.doe@example.com" },
              },
            },
          },
        ],
        responses: {
          201: { description: "User created successfully" },
        },
      },
    },
    "/{id}": {
      get: {
        summary: "Get user by ID",
        parameters: [
          { in: "path", name: "id", required: true, type: "integer" },
        ],
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
                name: { type: "string", example: "Updated Name" },
                email: { type: "string", example: "updated.email@example.com" },
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
  },
};
