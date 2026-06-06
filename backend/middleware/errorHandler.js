const morgan = require("morgan");

/**
 * HTTP request logger.
 * Use 'dev' in development, 'combined' in production.
 */
const requestLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev"
);

/**
 * 404 handler — catches any route not matched above.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
};

/**
 * Global error handler.
 * Express calls this when next(err) is called or a sync throw happens.
 * Must have 4 parameters to be recognized as error middleware.
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: "Validation error", details: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      error: `Duplicate value for ${field}. Please use a different value.`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  // JWT errors (in case not caught upstream)
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired. Please log in again." });
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
  }

  // Default 500
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
};

module.exports = { requestLogger, notFound, globalErrorHandler };
