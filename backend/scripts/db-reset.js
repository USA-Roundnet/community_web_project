// scripts/db-reset.js
// Rollback ALL -> migrate latest -> (optional) seed
const db = require('../knex-config');

(async () => {
  try {
    console.log('Rolling back ALL migrations...');
    await db.migrate.rollback({ all: true });

    console.log('Applying latest migrations...');
    await db.migrate.latest();

    console.log('Running seeds...');
    await db.seed.run();

    console.log('✅ DB reset complete');
    process.exit(0);
  } catch (e) {
    console.error('❌ DB reset failed\n', e);
    process.exit(1);
  } finally {
    try { await db.destroy(); } catch {}
  }
})();
