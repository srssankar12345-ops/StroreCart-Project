import redisClient from '../config/redis.js';

export const rateLimiter = (maxRequests = 5, windowMs = 60*1000*10) => {
  return async (req, res, next) => {
    const email = req.body.email || req.connection.remoteAddress;
    const key = `rateLimit:${email}`;

    try {
      const current = await redisClient.get(key);
      if (current !== null && parseInt(current) >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: windowMs / 1000,
        });
      }

      await redisClient.incr(key);
      if (parseInt(current) === 0) {
        await redisClient.expire(key, windowMs / 1000);
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next(); // Fail open
    }
  };
};