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

  const seriesExists = await knex.schema.hasTable("Series");
  if (seriesExists) {
    const hasReg1SeedSnapshot = await knex.schema.hasColumn(
      "Series",
      "registration1_seed_snapshot"
    );
    const hasReg2SeedSnapshot = await knex.schema.hasColumn(
      "Series",
      "registration2_seed_snapshot"
    );

    await knex.schema.alterTable("Series", (table) => {
      if (!hasReg1SeedSnapshot) {
        table.integer("registration1_seed_snapshot").nullable();
      }
      if (!hasReg2SeedSnapshot) {
        table.integer("registration2_seed_snapshot").nullable();
      }
    });
  }
};

exports.down = async function (knex) {
  const seriesExists = await knex.schema.hasTable("Series");
  if (seriesExists) {
    const hasReg1SeedSnapshot = await knex.schema.hasColumn(
      "Series",
      "registration1_seed_snapshot"
    );
    const hasReg2SeedSnapshot = await knex.schema.hasColumn(
      "Series",
      "registration2_seed_snapshot"
    );

    await knex.schema.alterTable("Series", (table) => {
      if (hasReg1SeedSnapshot) {
        table.dropColumn("registration1_seed_snapshot");
      }
      if (hasReg2SeedSnapshot) {
        table.dropColumn("registration2_seed_snapshot");
      }
    });
  }

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
