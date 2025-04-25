exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Series");
  if (!exists) {
    await knex.schema.createTable("Series", (table) => {
      table.increments("id").primary();
      table.integer("tournament_id").unsigned().notNullable();
      table.integer("registration1_id").unsigned().notNullable();
      table.integer("registration2_id").unsigned().notNullable();
      table
        .enum("series_type", ["best_of_1", "best_of_3", "best_of_5"])
        .notNullable();
      table.string("location", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Series");
};
