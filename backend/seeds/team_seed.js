// seeds/team_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Team").del();

  // Inserts seed entries
  await knex("Team").insert([
    {
      name: "Team Alpha",
      public: false,
      size: 5,
      description: "A competitive team focused on winning.",
    },
    {
      name: "Team Beta",
      public: true,
      size: 3,
      description: "A casual team for fun and practice.",
    },
  ]);
};
