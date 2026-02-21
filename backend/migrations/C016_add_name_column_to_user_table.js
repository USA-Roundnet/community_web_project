exports.up = async function (knex) {
  const tableExists = await knex.schema.hasTable("User");
  if (!tableExists) {
    return;
  }

  const hasNameColumn = await knex.schema.hasColumn("User", "name");
  if (!hasNameColumn) {
    await knex.schema.alterTable("User", (table) => {
      table.string("name", 255);
    });
  }
};

exports.down = async function (knex) {
  const tableExists = await knex.schema.hasTable("User");
  if (!tableExists) {
    return;
  }

  const hasNameColumn = await knex.schema.hasColumn("User", "name");
  if (hasNameColumn) {
    await knex.schema.alterTable("User", (table) => {
      table.dropColumn("name");
    });
  }
};
