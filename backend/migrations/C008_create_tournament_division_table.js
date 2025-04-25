exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("TournamentDivision");
  if (!exists) {
    await knex.schema.createTable("TournamentDivision", (table) => {
      table.increments("id").primary();
      table.integer("division_id").unsigned().notNullable();
      table.integer("tournament_id").unsigned().notNullable();
      table.integer("registration_fee");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("TournamentDivision");
};
