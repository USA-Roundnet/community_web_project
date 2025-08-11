exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (exists) {
    await knex.schema.alterTable("Division", (table) => {
      table
        .foreign("creator_id")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("Division");
  if (exists) {
    await knex.schema.alterTable("Division", (table) => {
      table.dropForeign("creator_id");
    });
  }
};
