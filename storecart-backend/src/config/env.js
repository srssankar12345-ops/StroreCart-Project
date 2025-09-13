module.exports = function loadEnv() {
  const dotenv = require("dotenv");
  const result = dotenv.config();
  if (result.error) {
    console.warn("No .env file loaded (ensure environment variables are set).");
  }

  const required = [
    "DATABASE_URL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_SECRET",
    "JWT_ACCESS_EXPIRY",
    "JWT_REFRESH_EXPIRY"
  ];

  // in non-development, ensure required exist
  if (process.env.NODE_ENV === "production") {
    required.forEach(k => {
      if (!process.env[k]) {
        throw new Error(`Missing required env var: ${k}`);
      }
    });
  }
};
