exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentDivision");
  if (exists) {
    await knex.schema.alterTable("TournamentDivision", (table) => {
      table
        .foreign("division_id")
        .references("id")
        .inTable("Division")
        .onDelete("CASCADE");
      table
        .foreign("tournament_id")
        .references("id")
        .inTable("Tournament")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentDivision");
  if (exists) {
    await knex.schema.alterTable("TournamentDivision", (table) => {
      table.dropForeign("division_id");
      table.dropForeign("tournament_id");
    });
  }
};
