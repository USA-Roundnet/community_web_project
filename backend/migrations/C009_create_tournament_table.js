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
      table.string("timezone", 50).notNullable();
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
