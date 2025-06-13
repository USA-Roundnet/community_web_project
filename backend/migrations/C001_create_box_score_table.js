exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("BoxScore");
  if (!exists) {
    await knex.schema.createTable("BoxScore", (table) => {
      table.increments("id").primary();
      table.integer("game_id").unsigned().notNullable();
      table.integer("player_id").unsigned().notNullable();
      table.integer("serves_attempted");
      table.integer("serves_landed");
      table.integer("defensive_touches");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("BoxScore");
};
