import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const REDIS_SESSION_TTL = parseInt(process.env.REDIS_SESSION_TTL) || 3600;

// Database
export const DATABASE_URL = process.env.DATABASE_URL;

// Redis
export const REDIS_URL = process.env.REDIS_URL;