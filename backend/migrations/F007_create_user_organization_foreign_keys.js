exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("UserOrganization");
  if (exists) {
    await knex.schema.alterTable("UserOrganization", (table) => {
      table
        .foreign("user_id")
        .references("id")
        .inTable("User")
        .onDelete("CASCADE");
      table
        .foreign("organization_id")
        .references("id")
        .inTable("Organization")
        .onDelete("CASCADE");
    });
  }
};

exports.down = async function (knex) {
  const exists = await knex.schema.hasTable("UserOrganization");
  if (exists) {
    await knex.schema.alterTable("UserOrganization", (table) => {
      table.dropForeign("user_id");
      table.dropForeign("organization_id");
    });
  }
};
