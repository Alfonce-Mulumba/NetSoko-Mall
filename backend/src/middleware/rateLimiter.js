import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: "error", message: "Too many requests from this IP, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { status: "error", message: "Too many requests, slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
