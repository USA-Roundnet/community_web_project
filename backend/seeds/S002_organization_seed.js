// seeds/organization_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Organization").del();

  // Inserts seed entries
  await knex("Organization").insert([
    {
      name: "Organization 1",
      city: "City 1",
      state_province: "State 1",
      zip_code: "12345",
      country: "Country 1",
      email: "org1@example.com",
      website: "https://org1.com",
      phone_number: "123-456-7890",
    },
    {
      name: "Organization 2",
      city: "City 2",
      state_province: "State 2",
      zip_code: "67890",
      country: "Country 2",
      email: "org2@example.com",
      website: "https://org2.com",
      phone_number: "987-654-3210",
    },
  ]);
};
