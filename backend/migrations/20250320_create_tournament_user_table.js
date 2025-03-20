// migrations/20250320_create_tournament_user_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentUser");
  if (!exists) {
    return knex.schema.createTable("TournamentUser", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .integer("tournament_division_id")
        .unsigned()
        .references("id")
        .inTable("TournamentDivision")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("TournamentUser");
};
