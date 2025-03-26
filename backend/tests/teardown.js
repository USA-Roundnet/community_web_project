const db = require("../knex-config");
const { server } = require("../index");

module.exports = async () => {
  try {
    await db.destroy();
    if (server && typeof server.close === "function") {
      await new Promise((resolve) => server.close(resolve));
    }
    console.log("✓ Test resources cleaned up");
  } catch (error) {
    console.error("Failed to clean up test resources:", error);
    process.exit(1);
  }
};
