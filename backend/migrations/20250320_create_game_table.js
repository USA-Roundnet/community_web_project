// migrations/20250320_create_game_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Game");
  if (!exists) {
    await knex.schema.createTable("Game", (table) => {
      table.increments("id").primary();
      table.integer("serie_id").unsigned().notNullable();
      table.integer("game_number");
      table.integer("team1_score");
      table.integer("team2_score");
      table
        .enum("status", ["not_started", "in_progress", "completed"])
        .notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Game");
};
