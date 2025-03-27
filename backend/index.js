const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/organizations", require("./routes/organizationRoutes"));
app.use("/api/userOrganizations", require("./routes/userOrganizationRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/userTeams", require("./routes/userTeamRoutes"));
app.use("/api/tournaments", require("./routes/tournamentRoutes"));

// Catch-all Route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// At the bottom of index.js:
let server = null;

if (!server) {
  if (process.env.NODE_ENV === "test") {
    // In test environment, create server on random port
    server = app.listen(0); // 0 means random available port
    console.log(`Test server created on port ${server.address().port}`);
  } else {
    // In dev/prod, use configured port
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
    });
  }
}

module.exports = { app, server };
