const DEFAULT_DEV_JWT_SECRET = "local-dev-jwt-secret-change-me";
let hasWarnedAboutDefaultSecret = false;

const getJwtSecret = () => {
  const providedSecret = process.env.JWT_SECRET?.trim();
  if (providedSecret) {
    return providedSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  if (!hasWarnedAboutDefaultSecret) {
    hasWarnedAboutDefaultSecret = true;
    console.warn(
      "JWT_SECRET is not set. Using local development fallback secret."
    );
  }

  return DEFAULT_DEV_JWT_SECRET;
};

module.exports = {
  getJwtSecret,
};
