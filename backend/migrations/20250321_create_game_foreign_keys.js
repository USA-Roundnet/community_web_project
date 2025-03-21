exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Game");
  if (exists) {
    await knex.schema.alterTable("Game", (table) => {
      table
        .foreign("serie_id")
        .references("id")
        .inTable("Serie")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("Game");
  if (exists) {
    await knex.schema.alterTable("Game", (table) => {
      table.dropForeign("serie_id");
    });
  }
};
