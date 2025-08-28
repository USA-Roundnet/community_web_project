// scripts/db-reset-sql.js
// Brutal reset using raw SQL (drops known tables), then migrate + seed.
// Useful if schema drifted after running manual SQL like session.sql.
const db = require('../knex-config');

const TABLES = [
  'division',
  'game',
  'organization',
  'registration',
  'series',
  'team',
  'teamtype',
  'tournament',
  'tournamentdivision',
  'tournamentuser',
  'user',
  'userorganization',
  'userteam',
  'boxscore'
];

(async () => {
  try {
    console.log('Disabling FK checks...');
    await db.raw('SET FOREIGN_KEY_CHECKS = 0');

    const list = TABLES.join(', ');
    console.log('Dropping tables if exist:', list);
    await db.raw(`DROP TABLE IF EXISTS ${list}`);

    console.log('Re-enabling FK checks...');
    await db.raw('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Applying latest migrations...');
    await db.migrate.latest();

    // console.log('Running seeds...');
    // await db.seed.run();

    console.log('✅ SQL reset complete');
    process.exit(0);
  } catch (e) {
    console.error('❌ SQL reset failed\n', e);
    process.exit(1);
  } finally {
    try { await db.destroy(); } catch {}
  }
})();
