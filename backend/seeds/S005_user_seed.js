const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  console.log("Running seed: user_seed.js");
  try {
    await knex("User").del();
    console.log("Deleted existing users");

    const basicPassword = await bcrypt.hash("basicpass123", 10);
    const adminPassword = await bcrypt.hash("admin", 10);

    await knex("User").insert([
      {
        role: "user",
        first_name: "basic",
        last_name: "user",
        username: "basicuser",
        gender: "male",
        email: "basicuser@example.com",
        city: "City 1",
        state_province: "State 1",
        zip_code: "12345",
        country: "Country 1",
        phone_number: "123-456-7890",
        date_of_birth: "1990-01-01",
        profile_picture_url: "https://example.com/john.jpg",
        password: basicPassword,
      },
      {
        role: "admin",
        first_name: "admin",
        last_name: "user",
        username: "adminuser",
        gender: "male",
        email: "adminuser@example.com",
        city: "City 2",
        state_province: "State 2",
        zip_code: "54321",
        country: "Country 2",
        phone_number: "098-765-4321",
        date_of_birth: "1985-05-15",
        profile_picture_url: "https://example.com/admin.jpg",
        password: adminPassword,
      },
    ]);
    console.log("Inserted seed data for users");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
