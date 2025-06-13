exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Tournament");
  if (exists) {
    await knex.schema.alterTable("Tournament", (table) => {
      table
        .integer("director_id")
        .unsigned()
        .references("id")
        .inTable("User")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("Tournament");
  if (exists) {
    await knex.schema.alterTable("Tournament", (table) => {
      table.dropForeign("director_id");
    });
  }
};
