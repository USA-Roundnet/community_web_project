// scripts/db-reset.js
// Rollback ALL -> migrate latest -> (optional) seed
const readline = require('readline');
const db = require('../knex-config');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  '⚠️ This will RESET your database (all data will be lost). Type "yes" to continue: ',
  async (answer) => {
    rl.close();
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('❌ Aborted by user.');
      process.exit(0);
    }

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
  }
);