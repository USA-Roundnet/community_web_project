// migrations/20250425_create_tournament_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Tournament");
  if (!exists) {
    await knex.schema.createTable("Tournament", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("city", 100);
      table.string("state_province", 100);
      table.string("zip_code", 20);
      table.string("country", 100);
      table
        .enum("timezone", [
          "UTC -12",
          "UTC -11",
          "UTC -10",
          "UTC -9",
          "UTC -8",
          "UTC -7",
          "UTC -6",
          "UTC -5",
          "UTC -4",
          "UTC -3",
          "UTC -2",
          "UTC -1",
          "UTC",
          "UTC +1",
          "UTC +2",
          "UTC +3",
          "UTC +4",
          "UTC +5",
          "UTC +6",
          "UTC +7",
          "UTC +8",
          "UTC +9",
          "UTC +10",
          "UTC +11",
          "UTC +12",
        ])
        .notNullable();
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

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Tournament");
};
