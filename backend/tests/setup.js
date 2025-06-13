const db = require("../knex-config");

module.exports = async () => {
  try {
    await db.migrate.rollback({ all: true });
    await db.migrate.latest();
    await db.seed.run();
    console.log("✓ Test database prepared");
  } catch (error) {
    console.error("Failed to prepare test database:", error);
    process.exit(1);
  }
};
