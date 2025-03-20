// migrations/20250320_create_game_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (!exists) {
    return knex.schema.createTable("Game", (table) => {
      table.increments("id").primary();
      table
        .integer("serie_id")
        .unsigned()
        .references("id")
        .inTable("Serie")
        .onDelete("CASCADE");
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

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Game");
};
