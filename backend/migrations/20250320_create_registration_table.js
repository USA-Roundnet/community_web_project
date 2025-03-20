// migrations/20250320_create_registration_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (!exists) {
    return knex.schema.createTable("Registration", (table) => {
      table.increments("id").primary();
      table
        .integer("team_id")
        .unsigned()
        .references("id")
        .inTable("Team")
        .onDelete("CASCADE");
      table.integer("group_id");
      table
        .integer("tournament_division_id")
        .unsigned()
        .references("id")
        .inTable("TournamentDivision")
        .onDelete("CASCADE");
      table.integer("placement");
      table.integer("seed");
      table.enum("status", ["registered", "withdrawn"]);
      table.enum("payment_status", ["paid", "pending", "unpaid"]).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Registration");
};
