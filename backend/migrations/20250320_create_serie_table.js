// migrations/20250320_create_serie_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("Serie");
  if (!exists) {
    return knex.schema.createTable("Serie", (table) => {
      table.increments("id").primary();
      table
        .integer("tournament_id")
        .unsigned()
        .references("id")
        .inTable("Tournament")
        .onDelete("CASCADE");
      table
        .integer("registration1_id")
        .unsigned()
        .references("id")
        .inTable("Registration")
        .onDelete("CASCADE");
      table
        .integer("registration2_id")
        .unsigned()
        .references("id")
        .inTable("Registration")
        .onDelete("CASCADE");
      table
        .enum("series_type", ["best_of_1", "best_of_3", "best_of_5"])
        .notNullable();
      table.string("location", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("Serie");
};
