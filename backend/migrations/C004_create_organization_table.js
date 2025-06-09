exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Organization");
  if (!exists) {
    await knex.schema.createTable("Organization", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("city", 100);
      table.string("state_province", 100);
      table.string("zip_code", 20);
      table.string("country", 100);
      table.string("email", 255);
      table.string("website", 255);
      table.string("phone_number", 20);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Organization");
};
