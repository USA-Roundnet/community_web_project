const db = require("../knex-config");

module.exports = async () => {
  await db.migrate.rollback({ all: true });
  await db.migrate.latest();
  await db.seed.run();
};
