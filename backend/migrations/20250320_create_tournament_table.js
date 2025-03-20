// migrations/20250320_create_tournament_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Tournament");
  if (!exists) {
    return knex.schema.createTable("Tournament", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("city", 100);
      table.string("state_province", 100);
      table.string("zip_code", 20);
      table.string("country", 100);
      table.enum("timezone", ["EST", "CST", "MST", "PST"]).notNullable();
      table
        .enum("status", ["upcoming", "in_progress", "completed"])
        .notNullable();
      table.enum("format", ["asl", "college", "classic"]).notNullable();
      table.string("phone_number", 20);
      table.string("email", 255);
      table.dateTime("start_date");
      table.dateTime("end_date");
      table.integer("max_teams");
      table.dateTime("registration_deadline");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Tournament");
};
