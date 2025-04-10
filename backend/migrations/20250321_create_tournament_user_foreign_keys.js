exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentUser");
  if (exists) {
    await knex.schema.alterTable("TournamentUser", (table) => {
      table
        .foreign("user_id")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .foreign("tournament_division_id")
        .references("id")
        .inTable("TournamentDivision")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentUser");
  if (exists) {
    await knex.schema.alterTable("TournamentUser", (table) => {
      table.dropForeign("user_id");
      table.dropForeign("tournament_division_id");
    });
  }
};
