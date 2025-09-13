const prisma = require("../../config/db");
const redis = require("../../config/redis");
const { hashPassword, comparePassword } = require("../../utils/password");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const createError = require("http-errors");

const REFRESH_PREFIX = "refresh:"; // redis key prefix

async function signup({ email, password, name }) {
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) throw createError(409, "Email already in use");
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashed, name }
  });
  return { id: user.id, email: user.email, name: user.name };
}

async function login({ email, password }, res) {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) throw createError(401, "Invalid credentials");
  const match = await comparePassword(password, user.password);
  if (!match) throw createError(401, "Invalid credentials");

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // Save refresh token in redis with expiry
  const rtKey = `${REFRESH_PREFIX}${refreshToken}`;
  // TTL in seconds — parse expiry (approx) : we rely on JWT expiry string — to be safe set 30 days or use decode
  const ttlInSeconds = Math.floor((parseExpiryToSeconds(process.env.JWT_REFRESH_EXPIRY || "30d")));
  await redis.set(rtKey, JSON.stringify({ userId: user.id }), { ex: ttlInSeconds });

  // Set cookie
  setRefreshCookie(res, refreshToken, ttlInSeconds);

  return { accessToken, user: { id: user.id, email: user.email, name: user.name }};
}

async function refresh({ cookieRefreshToken }, res) {
  if (!cookieRefreshToken) throw createError(401, "No refresh token");
  // verify JWT
  const payload = verifyRefreshToken(cookieRefreshToken);
  // Check redis existence
  const rtKey = `${REFRESH_PREFIX}${cookieRefreshToken}`;
  const found = await redis.get(rtKey);
  if (!found) throw createError(401, "Refresh token invalid or expired");
  const parsed = JSON.parse(found);
  const user = await prisma.user.findUnique({ where: { id: parsed.userId }});
  if (!user) throw createError(401, "User not found");

  const newAccess = signAccessToken(user);
  const newRefresh = signRefreshToken(user);

  const ttlInSeconds = Math.floor((parseExpiryToSeconds(process.env.JWT_REFRESH_EXPIRY || "30d")));
  // Save new refresh, delete old
  await redis.set(`${REFRESH_PREFIX}${newRefresh}`, JSON.stringify({ userId: user.id }), { ex: ttlInSeconds });
  await redis.del(rtKey);

  setRefreshCookie(res, newRefresh, ttlInSeconds);

  return { accessToken: newAccess, user: { id: user.id, email: user.email, name: user.name }};
}

async function logout({ cookieRefreshToken }, res) {
  if (cookieRefreshToken) {
    await redis.del(`${REFRESH_PREFIX}${cookieRefreshToken}`);
  }
  // Clear cookie
  res.clearCookie(process.env.COOKIE_NAME || "storecart_rt", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/"
  });
}

// helpers
function setRefreshCookie(res, refreshToken, ttlInSeconds) {
  const cookieName = process.env.COOKIE_NAME || "storecart_rt";
  const secure = process.env.COOKIE_SECURE === "true";
  const domain = process.env.COOKIE_DOMAIN || undefined;
  res.cookie(cookieName, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    domain,
    maxAge: ttlInSeconds * 1000,
    path: "/"
  });
}

// naive parse: convert "30d" "15m" to seconds
function parseExpiryToSeconds(str) {
  if (typeof str !== "string") return Number(str) || 0;
  const unit = str.slice(-1);
  const num = parseInt(str.slice(0, -1));
  if (unit === "s") return num;
  if (unit === "m") return num * 60;
  if (unit === "h") return num * 3600;
  if (unit === "d") return num * 86400;
  // fallback: try seconds
  return parseInt(str) || 0;
}

module.exports = { signup, login, refresh, logout };
