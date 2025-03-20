// migrations/20250320_create_box_score_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("BoxScore");
  if (!exists) {
    return knex.schema.createTable("BoxScore", (table) => {
      table.increments("id").primary();
      table
        .integer("game_id")
        .unsigned()
        .references("id")
        .inTable("Game")
        .onDelete("CASCADE");
      table
        .integer("player_id")
        .unsigned()
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table.integer("serves_attempted");
      table.integer("serves_landed");
      table.integer("defensive_touches");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("BoxScore");
};
