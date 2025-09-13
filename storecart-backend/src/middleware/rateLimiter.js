const redis = require("../config/redis");

const WINDOW_SECONDS = parseInt(process.env.RATE_LIMIT_WINDOW || "60"); // 60s
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "5"); // per window

async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    const key = `rl:${ip}:${Math.floor(Date.now()/1000 / WINDOW_SECONDS)}`; // bucket
    const current = await redis.incr(key);
    if (current === 1) {
      // set expiry
      await redis.expire(key, WINDOW_SECONDS);
    }
    if (current > MAX_REQUESTS) {
      return res.status(429).json({ success: false, message: "Too many requests" });
    }
    next();
  } catch (err) {
    // if redis fail, don't block; go ahead (fail-open)
    console.warn("Rate limiter error:", err);
    next();
  }
}

module.exports =  rateLimiter ;
