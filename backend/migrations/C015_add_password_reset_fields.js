exports.up = async function (knex) {
  return knex.schema.table("User", (table) => {
    table.string("reset_password_token").nullable();
    table.timestamp("reset_password_expires").nullable();
  });
};

exports.down = async function (knex) {
  return knex.schema.table("User", (table) => {
    table.dropColumn("reset_password_token");
    table.dropColumn("reset_password_expires");
  });
};
