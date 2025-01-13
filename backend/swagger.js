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
    },
  },
};
