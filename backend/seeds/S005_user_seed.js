exports.seed = async function (knex) {
  console.log("Running seed: user_seed.js");
  try {
    await knex("User").del();
    console.log("Deleted existing users");
    await knex("User").insert([
      {
        first_name: "John",
        last_name: "Doe",
        username: "johndoe",
        gender: "male",
        email: "john@example.com",
        city: "City 1",
        state_province: "State 1",
        zip_code: "12345",
        country: "Country 1",
        phone_number: "123-456-7890",
        date_of_birth: "1990-01-01",
        profile_picture_url: "https://example.com/john.jpg",
        password: "hashedpassword123",
      },
    ]);
    console.log("Inserted seed data for users");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
