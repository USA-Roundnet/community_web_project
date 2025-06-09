exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("BoxScore");
  if (exists) {
    await knex.schema.alterTable("BoxScore", (table) => {
      table
        .foreign("game_id")
        .references("id")
        .inTable("Game")
        .onDelete("CASCADE");
      table
        .foreign("player_id")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("BoxScore");
  if (exists) {
    await knex.schema.alterTable("BoxScore", (table) => {
      table.dropForeign("game_id");
      table.dropForeign("player_id");
    });
  }
};
