// seeds/team_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Team").del();

  // Inserts seed entries
  await knex("Team").insert([
    {
      name: "Team Alpha",
      team_type_id: 1,
      public: false,
      description: "A competitive team focused on winning.",
    },
    {
      name: "Team Beta",
      team_type_id: 2,
      public: true,
      description: "A casual team for fun and practice.",
    },
  ]);
};
