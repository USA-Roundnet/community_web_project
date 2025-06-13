require("dotenv").config(); // Load environment variables

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "community_web_project",
      port: process.env.DB_PORT || 3306,
      charset: "utf8mb4",
    },
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" },
  },

  test: {
    client: "mysql2",
    connection: {
      host: process.env.TEST_DB_HOST || "127.0.0.1",
      user: process.env.TEST_DB_USER || "root",
      password: process.env.TEST_DB_PASSWORD || "",
      database: process.env.TEST_DB_NAME || "community_web_project_test",
      port: process.env.TEST_DB_PORT || 3306,
      charset: "utf8mb4",
    },
    migrations: { directory: "./migrations" },
    seeds: { directory: "./seeds" },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: process.env.STAGING_DB_HOST || "127.0.0.1",
      database: process.env.STAGING_DB_NAME || "my_db",
      user: process.env.STAGING_DB_USER || "username",
      password: process.env.STAGING_DB_PASSWORD || "password",
      port: process.env.STAGING_DB_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: process.env.PROD_DB_HOST || "127.0.0.1",
      database: process.env.PROD_DB_NAME || "my_db",
      user: process.env.PROD_DB_USER || "username",
      password: process.env.PROD_DB_PASSWORD || "password",
      port: process.env.PROD_DB_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};
