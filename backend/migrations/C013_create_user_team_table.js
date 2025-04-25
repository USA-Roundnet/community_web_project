exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserTeam");
  if (!exists) {
    await knex.schema.createTable("UserTeam", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("team_id").unsigned().notNullable();
      table.enum("status", ["invited", "accepted", "declined"]).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("UserTeam");
};
