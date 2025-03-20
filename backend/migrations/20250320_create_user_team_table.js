// migrations/20250320_create_user_team_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserTeam");
  if (!exists) {
    return knex.schema.createTable("UserTeam", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .integer("team_id")
        .unsigned()
        .references("id")
        .inTable("Team")
        .onDelete("CASCADE");
      table.enum("status", ["invited", "accepted", "declined"]).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("UserTeam");
};
