exports.up = async function (knex) {
  const teamExists = await knex.schema.hasTable("Team");
  const teamTypeExists = await knex.schema.hasTable("TeamType");
  if (teamExists && teamTypeExists) {
    await knex.schema.alterTable("Team", (table) => {
      table
        .integer("team_type_id")
        .unsigned()
        .references("id")
        .inTable("TeamType")
        .onDelete("SET NULL")
        .onUpdate("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const teamExists = await knex.schema.hasTable("Team");
  if (teamExists) {
    await knex.schema.alterTable("Team", (table) => {
      table.dropForeign("team_type_id");
      table.dropColumn("team_type_id");
    });
  }
};
