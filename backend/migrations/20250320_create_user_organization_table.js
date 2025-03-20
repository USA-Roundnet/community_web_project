// migrations/20250320_create_user_organization_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserOrganization");
  if (!exists) {
    return knex.schema.createTable("UserOrganization", (table) => {
      table.increments("id").primary();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("Organization")
        .onDelete("CASCADE");
      table.enum("role", ["admin", "member"]).notNullable();
      table.enum("status", ["invited", "accepted", "declined"]).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("UserOrganization");
};
