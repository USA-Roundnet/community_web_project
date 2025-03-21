// migrations/20250320_create_user_table.js
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("User");
  if (!exists) {
    await knex.schema.createTable("User", (table) => {
      table.increments("id").primary();
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.string("username", 255).unique();
      table.enum("gender", ["male", "female", "other"]);
      table.string("email", 255).unique().notNullable();
      table.string("city", 100);
      table.string("state_province", 100);
      table.string("zip_code", 20);
      table.string("country", 100);
      table.string("phone_number", 20);
      table.date("date_of_birth");
      table.string("profile_picture_url", 255);
      table.text("password");
      table.enum("auth_provider", ["local", "google"]);
      table.string("google_id", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("User");
};
