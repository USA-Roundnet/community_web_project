exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (!exists) {
    await knex.schema.createTable("Division", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Division");
};
