exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TeamType");
  if (!exists) {
    await knex.schema.createTable("TeamType", (table) => {
      table.increments("id").primary();
      table.string("name", 50).notNullable(); // e.g., "4-player", "with-coach"
      table.integer("max_players").notNullable();
      table.integer("max_coaches").defaultTo(0);
      table.text("description");
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("TeamType");
};
