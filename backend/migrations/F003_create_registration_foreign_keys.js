exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Registration");
  if (exists) {
    await knex.schema.alterTable("Registration", (table) => {
      table
        .foreign("team_id")
        .references("id")
        .inTable("Team")
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
  const exists = await knex.schema.hasTable("Registration");
  if (exists) {
    await knex.schema.alterTable("Registration", (table) => {
      table.dropForeign("team_id");
      table.dropForeign("tournament_division_id");
    });
  }
};
