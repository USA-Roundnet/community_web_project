exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("User");
  if (!exists) {
    await knex.schema.createTable("User", (table) => {
      // add elo, rank, and status
      table.increments("id").primary();
      table.string("first_name", 255).notNullable();
      table.string("last_name", 255).notNullable();
      table.string("username", 255).unique().notNullable();
      table.enum("gender", ["male", "female", "other"]).notNullable();
      table.string("email", 255).unique().notNullable();
      table.string("city", 100).notNullable();
      table.string("state_province", 100).notNullable();
      table.string("zip_code", 20).notNullable();
      table.string("country", 100).notNullable();
      table.string("phone_number", 20).notNullable();
      table.date("date_of_birth").notNullable();
      table.string("profile_picture_url", 255);
      table.text("password");
      table.enum("auth_provider", ["local", "google"]);
      table.string("google_id", 255);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("elo");
      table.integer("rank");
      table.enum("status", ["bronze", "silver", "gold", "pro"]);
    });
  }
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("User");
};
