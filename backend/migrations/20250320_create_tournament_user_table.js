// migrations/20250320_create_tournament_user_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentUser");
  if (!exists) {
    await knex.schema.createTable("TournamentUser", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("tournament_division_id").unsigned().notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("TournamentUser");
};
