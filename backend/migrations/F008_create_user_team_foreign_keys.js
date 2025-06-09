exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserTeam");
  if (exists) {
    await knex.schema.alterTable("UserTeam", (table) => {
      table
        .foreign("user_id")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .foreign("team_id")
        .references("id")
        .inTable("Team")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("UserTeam");
  if (exists) {
    await knex.schema.alterTable("UserTeam", (table) => {
      table.dropForeign("user_id");
      table.dropForeign("team_id");
    });
  }
};
