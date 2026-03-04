exports.up = async function (knex) {
  const tournamentExists = await knex.schema.hasTable("Tournament");
  if (tournamentExists) {
    const hasPointsToWin = await knex.schema.hasColumn("Tournament", "points_to_win");
    const hasOvertimeCap = await knex.schema.hasColumn("Tournament", "overtime_cap");
    const hasWinBy = await knex.schema.hasColumn("Tournament", "win_by");

    await knex.schema.alterTable("Tournament", (table) => {
      if (!hasPointsToWin) {
        table.integer("points_to_win").unsigned().notNullable().defaultTo(21);
      }
      if (!hasOvertimeCap) {
        table.integer("overtime_cap").unsigned().notNullable().defaultTo(25);
      }
      if (!hasWinBy) {
        table.integer("win_by").unsigned().notNullable().defaultTo(2);
      }
    });
  }

};

exports.down = async function (knex) {
  const tournamentExists = await knex.schema.hasTable("Tournament");
  if (tournamentExists) {
    const hasPointsToWin = await knex.schema.hasColumn("Tournament", "points_to_win");
    const hasOvertimeCap = await knex.schema.hasColumn("Tournament", "overtime_cap");
    const hasWinBy = await knex.schema.hasColumn("Tournament", "win_by");

    await knex.schema.alterTable("Tournament", (table) => {
      if (hasPointsToWin) {
        table.dropColumn("points_to_win");
      }
      if (hasOvertimeCap) {
        table.dropColumn("overtime_cap");
      }
      if (hasWinBy) {
        table.dropColumn("win_by");
      }
    });
  }
};
