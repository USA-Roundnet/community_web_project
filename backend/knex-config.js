require("dotenv").config();
const knex = require("knex");
const knexConfig = require("./knexfile");

const environment = process.env.NODE_ENV || "development";

// Debugging
console.log(`Using environment: ${environment}`);
console.log("Knex configuration:", knexConfig[environment]);

if (!knexConfig[environment]) {
  console.error(`Knex configuration for '${environment}' is missing.`);
  process.exit(1); // Stop execution if config is missing
}

module.exports = knex(knexConfig[environment]);
