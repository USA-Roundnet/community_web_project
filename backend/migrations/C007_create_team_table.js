exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Team");
  if (!exists) {
    await knex.schema.createTable("Team", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.boolean("public").defaultTo(true);
      table.text("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Team");
};
