exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Serie");
  if (exists) {
    await knex.schema.alterTable("Serie", (table) => {
      table
        .foreign("tournament_id")
        .references("id")
        .inTable("Tournament")
        .onDelete("CASCADE");
      table
        .foreign("registration1_id")
        .references("id")
        .inTable("Registration")
        .onDelete("CASCADE");
      table
        .foreign("registration2_id")
        .references("id")
        .inTable("Registration")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("Serie");
  if (exists) {
    await knex.schema.alterTable("Serie", (table) => {
      table.dropForeign("tournament_id");
      table.dropForeign("registration1_id");
      table.dropForeign("registration2_id");
    });
  }
};
