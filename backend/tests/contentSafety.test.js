const {
  normalizeTextFields,
  findUnsafeTournamentText,
} = require("../utils/contentSafety");

describe("contentSafety utils", () => {
  test("normalizeTextFields trims and collapses whitespace", () => {
    const normalized = normalizeTextFields({
      name: "   Spring   Open   ",
      city: "  Austin  ",
      format: " classic ",
      start_date: "2026-03-01",
    });

    expect(normalized.name).toBe("Spring Open");
    expect(normalized.city).toBe("Austin");
    expect(normalized.format).toBe("classic");
    expect(normalized.start_date).toBe("2026-03-01");
  });

  test("findUnsafeTournamentText flags profanity", () => {
    const unsafe = findUnsafeTournamentText({
      name: "shit showdown",
      city: "Austin",
      state_province: "TX",
      country: "USA",
    });

    expect(unsafe).toEqual({ field: "name", reason: "profanity" });
  });

  test("findUnsafeTournamentText flags SQL injection patterns", () => {
    const unsafe = findUnsafeTournamentText({
      name: "My Event'; DROP TABLE Tournament; --",
      city: "Austin",
      state_province: "TX",
      country: "USA",
    });

    expect(unsafe).toEqual({ field: "name", reason: "sql_injection_pattern" });
  });

  test("findUnsafeTournamentText returns null for safe text", () => {
    const unsafe = findUnsafeTournamentText({
      name: "USAR Spring Classic",
      city: "Denver",
      state_province: "CO",
      country: "USA",
    });

    expect(unsafe).toBeNull();
  });
});
