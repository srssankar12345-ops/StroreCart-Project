import { verifyToken } from '../utils/jwt.js';
import redisClient from '../config/redis.js';
import { sendResponse } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, null, 'Authorization header required');
  }

  const token = authHeader.substring(7);

  try {
    // Check Redis cache first
    const cachedUser = await redisClient.get(`user:${token}`);
    if (cachedUser) {
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // Verify JWT
    const decoded = verifyToken(token);
    req.user = decoded;

    // Cache in Redis for future requests
    await redisClient.setEx(
      `user:${token}`,
      parseInt(process.env.REDIS_SESSION_TTL) || 3600,
      JSON.stringify(decoded)
    );

    next();
  } catch (error) {
    return sendResponse(res, 403, null, 'Invalid or expired token');
  }
};