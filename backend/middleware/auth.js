const jwt = require("jsonwebtoken");

/**
 * JWT Auth Middleware
 * Verifies the Bearer token in Authorization header.
 * Sets req.user = { id, email, role } on success.
 *
 * Usage in routes:
 *   const { protect, requireRole } = require('../middleware/auth');
 *   app.get('/admin/stats', protect, requireRole('admin'), handler);
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};

/**
 * Role-based access control middleware.
 * Must be used AFTER protect middleware.
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'Alumni', 'Student')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

/**
 * Generate a signed JWT for a user.
 * @param {{ id, email, role }} user
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { protect, requireRole, generateToken };
