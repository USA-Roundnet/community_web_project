// seeds/team_seed.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Team").del();

  // Look up team type ids by name to avoid hardcoded ids
  const twoPlayer = await knex("TeamType")
    .select("id")
    .where({ name: "2 player" })
    .first();
  const sevenPlayer = await knex("TeamType")
    .select("id")
    .where({ name: "7 player" })
    .first();

  if (!twoPlayer || !sevenPlayer) {
    throw new Error(
      "TeamType seeds missing (expected '2 player' and '7 player')"
    );
  }

  // Inserts seed entries
  await knex("Team").insert([
    {
      name: "Team Alpha",
      team_type_id: twoPlayer.id,
      public: false,
      description: "A competitive team focused on winning.",
    },
    {
      name: "Team Beta",
      team_type_id: sevenPlayer.id,
      public: true,
      description: "A casual team for fun and practice.",
    },
  ]);
};
