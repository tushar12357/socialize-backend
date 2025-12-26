// import Redis from "ioredis";

// const redisConfig = {
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT || 6379
// };

// // Normal client (optional, future use)
// export const redis = new Redis(redisConfig);

// // 🔥 Publisher — NORMAL MODE
// export const pub = new Redis(redisConfig);

// // 🔥 Subscriber — SUBSCRIBER MODE (IMPORTANT FIX)
// export const sub = new Redis({
//   ...redisConfig,
//   enableReadyCheck: false   // 🚨 THIS FIXES YOUR ERROR
// });
