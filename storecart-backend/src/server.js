import app from './app.js';
import redisClient from './config/redis.js';
import { PORT } from './config/env.js';

// Connect Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('🚀 Redis connected');
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    process.exit(1);
  }
})();

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('🛑 SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('🔌 HTTP server closed');
//     redisClient.quit();
//     process.exit(0);
//   });
// });

// process.on('SIGINT', () => {
//   console.log('🛑 SIGINT received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('🔌 HTTP server closed');
//     redisClient.quit();
//     process.exit(0);
//   });
// });