// migrations/20250320_create_team_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Team");
  if (!exists) {
    return knex.schema.createTable("Team", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.boolean("public").defaultTo(true);
      table.integer("size");
      table.text("description");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Team");
};
