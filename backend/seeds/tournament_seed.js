exports.seed = async function (knex) {
  await knex("Tournament").del();
  await knex("Tournament").insert([
    {
      name: "Tournament 1",
      city: "City 1",
      state_province: "State 1",
      zip_code: "12345",
      country: "Country 1",
      timezone: "EST",
      status: "upcoming",
      format: "asl",
      phone_number: "123-456-7890",
      email: "tournament1@example.com",
      start_date: "2024-01-01 10:00:00",
      end_date: "2024-01-02 18:00:00",
      max_teams: 10,
      registration_deadline: "2023-12-01 23:59:59",
    },
  ]);
};
