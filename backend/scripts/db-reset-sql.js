const readline = require('readline');
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
  'boxscore',
  'knex_migrations',
  'knex_migrations_lock',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  '⚠️ This will DROP ALL TABLES and RESET your database (all data will be lost). Type "yes" to continue: ',
  async (answer) => {
    rl.close();
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('❌ Aborted by user.');
      process.exit(0);
    }

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

      console.log('Running seeds...');
      await db.seed.run();

      console.log('✅ SQL reset complete');
      process.exit(0);
    } catch (e) {
      console.error('❌ SQL reset failed\n', e);
      process.exit(1);
    } finally {
      try { await db.destroy(); } catch {}
    }
  }
);