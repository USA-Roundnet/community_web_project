// migrations/20250320_create_user_organization_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserOrganization");
  if (!exists) {
    await knex.schema.createTable("UserOrganization", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.integer("organization_id").unsigned().notNullable();
      table.enum("role", ["admin", "member"]).notNullable();
      table.enum("status", ["invited", "accepted", "declined"]).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("UserOrganization");
};
