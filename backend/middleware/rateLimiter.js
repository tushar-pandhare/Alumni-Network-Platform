const rateLimit = require("express-rate-limit");

/**
 * General API limiter — 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait and try again." },
});

/**
 * Strict auth limiter — 10 attempts per 15 minutes per IP
 * Protects login and signup against brute force
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts. Please wait 15 minutes." },
  skipSuccessfulRequests: true, // only count failed requests
});

/**
 * Upload limiter — 20 requests per hour per IP
 * Protects Cloudinary upload endpoints
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Upload limit reached. Please try again in an hour." },
});

/**
 * Vote limiter — 30 votes per hour per IP
 * Prevents vote stuffing on suggestions
 */
const voteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Voting rate limit reached. Please wait before voting again." },
});

module.exports = { generalLimiter, authLimiter, uploadLimiter, voteLimiter };
