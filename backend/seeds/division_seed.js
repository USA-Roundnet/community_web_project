// seeds/division_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Division").del();

  // Inserts seed entries
  await knex("Division").insert([
    {
      name: "Open",
      max_teams: 16,
      created_at: new Date(),
    },
    {
      name: "Premier",
      max_teams: 16,
      created_at: new Date(),
    },
  ]);
};
