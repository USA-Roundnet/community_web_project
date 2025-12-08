# `migrations/` README (Knex + MySQL)

> tl;dr — Create tables with `C###_*`, add constraints with `F###_*`, and **always rollback/test before pushing**.  
> Early-stage note: since this project is still evolving **it’s OK to edit existing migration files** in dev. Once the schema is shared (CI/prod or other devs depend on it), treat old migrations as immutable and add new ones instead.

## What this is
Schema migrations for the API (Node + **Knex 3.x** with **mysql2**). Files are JavaScript. We stage base tables first (prefix `C###_...`) and then add foreign keys/constraints (prefix `F###_...`) to avoid dependency tangles.

### Folder layout
```
backend/
  migrations/
    C001_create_box_score_table.js
    C002_create_division_table.js
    ...
    F011_create_division_foreign_keys.js
  seeds/
    S001_division_seed.js
    S002_organization_seed.js
    S003_team_type_seed.js
    S004_team_seed.js
    S005_user_seed.js
    S006_tournament_seed.js
```
- `C###_...` = create base tables
- `F###_...` = add foreign keys and other constraints
- `S###_...` = add data to noted table

## Prereqs
- Node (compatible with Knex ^3.x)
- **MySQL** (or MariaDB) running locally
- `mysql2` driver installed
- `knexfile.js` / `knex-config.js` configured to point to `backend/migrations` and `backend/seeds`
- `.env` with DB connection vars (example):
  ```bash
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=your_user
  DB_PASSWORD=your_password
  DB_NAME=community_web_project_dev
  ```

## Commands (dev)
These use the existing `package.json` scripts:
```bash
# run all pending migrations
npm run migrate

# rollback the last batch
npm run rollback
```
If you need to run directly with Knex:
```bash
npx knex migrate:latest
npx knex migrate:rollback
```

## Conventions
- **Naming**
  - `C###_create_<table>_table.js` → brand-new table definitions
  - `F###_create_<entity>_foreign_keys.js` → FK/constraint batch after all base tables exist
- **IDs**: `table.increments('id').primary()`
- **Timestamps**: `table.timestamp('created_at').defaultTo(knex.fn.now())` (or `table.timestamps(true, true)` if you prefer created/updated)
- **Enums**: `table.enum('status', ['bronze','silver','gold','pro'])` (see `User`)
- **FKs**: default to `onDelete('CASCADE')` unless there’s a strong reason not to
- **Down migrations**: must fully reverse `up` (drop FKs before dropping columns/tables)

## Safe workflow
> In dev you *may* edit existing migrations, but any time you do so you must reset your local DB so ordering/constraints are re-validated.

1. **Start clean**
   ```bash
   npx knex migrate:rollback --all
   npx knex migrate:latest
   ```
2. **Make your changes**
   - New table? `C###_create_<table>_table.js`
   - New/updated relations? `F###_create_<entity>_foreign_keys.js`
   - *If you edited an old migration:* also do a full reset before testing/pushing.
3. **Write both directions**
   - `up` does the thing
   - `down` undoes the thing (drop foreigns, then columns/tables)
4. **Test the cycle**
   ```bash
   npx knex migrate:latest
   npx knex migrate:rollback
   npx knex migrate:latest
   ```

### Safety rules we follow
- Keep migrations **small and reversible**.
- Prefer **new migrations** for iterative changes once other people or environments depend on history.
- Never push a migration with an incomplete `down` step.
- Avoid destructive raw SQL unless there’s a matching safe rollback.
- When adding FKs, ensure the referenced table exists first (use the `F###` phase if needed).
- If seeds are required for tests, ensure they still pass after your change.

## Seeds
Basic seeds live under `backend/seeds/`. Tests prepare the DB via `tests/setup.js`:
```js
await db.migrate.rollback({ all: true });
await db.migrate.latest();
await db.seed.run();
```
Run manually if needed:
```bash
npx knex seed:run
```

## Typical dev flows

### A) Full reset + re-run
```bash
npx knex migrate:rollback --all
npx knex migrate:latest
npx knex seed:run   # optional
```

### B) Add or change a relation (example)
```bash
# 1) start clean
npx knex migrate:rollback --all

# 2) create a migration
npx knex migrate:make F012_update_division_foreign_keys

# 3) implement .up with alterTable('Division') add/drop FKs
#    implement .down to reverse (dropForeign etc.)

# 4) test the cycle
npx knex migrate:latest
npx knex migrate:rollback
npx knex migrate:latest
```

## Templates

### New table
```js
// C0xx_create_example_table.js
exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('Example');
  if (!exists) {
    await knex.schema.createTable('Example', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable('Example');
  if (exists) {
    await knex.schema.dropTableIfExists('Example');
  }
};
```

### Add a foreign key
```js
// F0xx_create_example_foreign_keys.js
exports.up = async (knex) => {
  const exists = await knex.schema.hasTable('Child');
  if (exists) {
    await knex.schema.alterTable('Child', (table) => {
      table
        .integer('parent_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('Parent')
        .onDelete('CASCADE');
    });
  }
};

exports.down = async (knex) => {
  const exists = await knex.schema.hasTable('Child');
  if (exists) {
    await knex.schema.alterTable('Child', (table) => {
      table.dropForeign('parent_id');
      table.dropColumn('parent_id');
    });
  }
};
```

## Quick reset scripts

### Reset via Knex (recommended during development)
```bash
npm run db:reset
```
This performs: rollback **all** → migrate **latest** → run **seeds**.

### Reset via raw SQL (useful after running `session.sql` or manual SQL)
```bash
npm run db:reset:sql
```
This performs:
1) `SET FOREIGN_KEY_CHECKS = 0;`  
2) `DROP TABLE IF EXISTS division, game, organization, registration, series, team, teamtype, tournament, tournamentdivision, user, userorganization, userteam;`  
3) `SET FOREIGN_KEY_CHECKS = 1;`  
4) migrate **latest** → run **seeds**.

> Use the SQL reset when your local schema was created/altered outside of Knex and you want to return to the canonical Knex-managed schema.

## Troubleshooting
- **“Table/column does not exist”** → order issue; ensure the `C###` ran before the `F###`.
- **Rollback fails** → `down` is missing `dropForeign`/`dropColumn`/`dropTableIfExists`.
- **After editing an old migration** → do a **full reset** (`rollback --all` → `latest`) so your local DB matches history.

---
*Happy migrating. And yes, Past-You, thank you for writing this README.*
