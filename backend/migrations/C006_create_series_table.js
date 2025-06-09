exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Series");
  if (!exists) {
    await knex.schema.createTable("Series", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").unsigned().notNullable();
      table.integer("registration1_id").unsigned().notNullable();
      table.integer("registration2_id").unsigned().notNullable();
      table.integer("winner_id").unsigned().nullable();
      table.tinyint("wins_needed").unsigned().notNullable().defaultTo(1);
      table.string("location", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Series");
};
