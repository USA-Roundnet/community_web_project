// seeds/team_type_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("TeamType").del();

  // Inserts seed entries
  await knex("TeamType").insert([
    {
      name: "2 player",
      max_players: 2,
      max_coaches: 1,
      description: "A standard team consisting of 2 players",
    },
    {
      name: "7 player",
      max_players: 7,
      max_coaches: 2,
      description: "ASL tournament format team with 7 players",
    },
  ]);
};
