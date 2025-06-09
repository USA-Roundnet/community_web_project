exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Registration");
  if (!exists) {
    await knex.schema.createTable("Registration", (table) => {
      table.increments("id").primary();
      table.integer("team_id").unsigned().notNullable();
      table.integer("group_id");
      table.integer("tournament_division_id").unsigned().notNullable();
      table.integer("placement");
      table.integer("seed");
      table.enum("status", ["registered", "withdrawn"]);
      table.enum("payment_status", ["paid", "pending", "unpaid"]).notNullable();
      table.boolean("checked_in").defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("Registration");
};
