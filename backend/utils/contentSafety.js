const textFieldsToNormalize = [
  "name",
  "city",
  "state_province",
  "zip_code",
  "country",
  "timezone",
  "status",
  "format",
  "phone_number",
  "email",
];

const profanityPatterns = [
  /\b(?:fuck|fucking|shit|bitch|asshole|bastard|dick|slut|whore|motherfucker)\b/i,
];

const sqlInjectionPatterns = [
  /'\s*or\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /"\s*or\s+["']?\d+["']?\s*=\s*["']?\d+/i,
  /\bunion\s+select\b/i,
  /\bdrop\s+table\b/i,
  /\binsert\s+into\b/i,
  /\bdelete\s+from\b/i,
  /\bupdate\s+\w+\s+set\b/i,
  /\bexec(?:ute)?\b/i,
  /;\s*(?:select|insert|update|delete|drop|alter|create)\b/i,
  /--/,
  /\/\*/,
];

const isString = (value) => typeof value === "string";

const normalizeWhitespace = (value) => value.replace(/\s+/g, " ").trim();

const normalizeTextFields = (payload = {}) => {
  const normalizedPayload = { ...payload };

  for (const field of textFieldsToNormalize) {
    if (isString(normalizedPayload[field])) {
      normalizedPayload[field] = normalizeWhitespace(normalizedPayload[field]);
    }
  }

  return normalizedPayload;
};

const findMatchingPattern = (value, patterns) =>
  patterns.find((pattern) => pattern.test(value)) || null;

const findUnsafeTournamentText = (payload = {}) => {
  const fieldsToScan = ["name", "city", "state_province", "country"];

  for (const field of fieldsToScan) {
    const value = payload[field];
    if (!isString(value) || value.length === 0) {
      continue;
    }

    if (findMatchingPattern(value, profanityPatterns)) {
      return { field, reason: "profanity" };
    }

    if (findMatchingPattern(value, sqlInjectionPatterns)) {
      return { field, reason: "sql_injection_pattern" };
    }
  }

  return null;
};

module.exports = {
  normalizeTextFields,
  findUnsafeTournamentText,
};
