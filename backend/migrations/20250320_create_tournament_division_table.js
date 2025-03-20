// migrations/20250320_create_tournament_division_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentDivision");
  if (!exists) {
    return knex.schema.createTable("TournamentDivision", (table) => {
      table.increments("id").primary();
      table
        .integer("division_id")
        .unsigned()
        .references("id")
        .inTable("Division")
        .onDelete("CASCADE");
      table
        .integer("tournament_id")
        .unsigned()
        .references("id")
        .inTable("Tournament")
        .onDelete("CASCADE");
      table.integer("registration_fee");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("TournamentDivision");
};
