const bcrypt = require("bcryptjs");
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

module.exports = { hashPassword, comparePassword };
