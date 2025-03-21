// migrations/20250320_create_division_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (!exists) {
    await knex.schema.createTable("Division", (table) => {
      table.increments("id").primary();
      table.enum("name", ["contender", "premier"]).notNullable();
      table.integer("max_teams");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Division");
};
