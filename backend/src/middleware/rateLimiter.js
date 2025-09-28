// backend/src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max requests per IP in window (login/register)
  message: { status: "error", message: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: { status: "error", message: "Too many requests, slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
