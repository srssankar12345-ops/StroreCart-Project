const jwt = require("jsonwebtoken");

function signAccessToken(user) {
  const payload = {};
  const options = {
    subject: String(user.id),
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    issuer: "storecart"
  };
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, options);
}

function signRefreshToken(user) {
  const payload = {};
  const options = {
    subject: String(user.id),
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "30d",
    issuer: "storecart"
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, options);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
}

module.exports = { signAccessToken, signRefreshToken, verifyRefreshToken };
