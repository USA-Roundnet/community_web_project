exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Game");
  if (exists) {
    await knex.schema.alterTable("Game", (table) => {
      table
        .foreign("series_id")
        .references("id")
        .inTable("Series")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("Game");
  if (exists) {
    await knex.schema.alterTable("Game", (table) => {
      table.dropForeign("series_id");
    });
  }
};
