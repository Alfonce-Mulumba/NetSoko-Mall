// src/middleware/errorHandler.js
import logger from "../utils/logger.js";

// ✅ 404 handler
export const notFound = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
};

// ✅ General error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode && Number(err.statusCode) >= 400 ? Number(err.statusCode) : 500;

  // Log structured error
  logger.error({
    msg: err.message || "Internal Server Error",
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
    body: req.body,
    user: req.user ? { id: req.user.id, email: req.user.email } : undefined,
  });

  const payload = {
    status: "error",
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  };

  // Include stack trace and detailed error in non-production
  if (process.env.NODE_ENV !== "production") {
    payload.error = err.message;
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
