const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const prisma = require("../config/db");

const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) throw createError(401, "No authorization token");
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    // attach user minimal info
    const user = await prisma.user.findUnique({ where: { id: payload.sub }});
    if (!user) throw createError(401, "User not found");
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

// convenience: role guard
const authorize = (roles = []) => (req, res, next) => {
  if (!req.user) return next(createError(401, "Not authenticated"));
  if (!roles.length) return next();
  if (!roles.includes(req.user.role)) return next(createError(403, "Forbidden"));
  next();
};

module.exports = { authenticate, authorize };
