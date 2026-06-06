const { body, param, query, validationResult } = require("express-validator");

/**
 * Runs validation rules and returns 400 if any fail.
 * Always place this last in a middleware chain.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth validators ─────────────────────────────────────────────────────────

const validateSignup = [
  body("fullname")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters"),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["Student", "Alumni", "Admin"]).withMessage("Role must be Student, Alumni, or Admin"),
  handleValidation,
];

const validateLogin = [
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

// ─── Profile validators ───────────────────────────────────────────────────────

const validateProfile = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("name").optional().trim().isLength({ max: 100 }).withMessage("Name too long"),
  body("mobile")
    .optional()
    .matches(/^(\+?\d{1,3}[- ]?)?\d{10}$/)
    .withMessage("Invalid mobile number format"),
  body("passingYear")
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 5 })
    .withMessage("Invalid passing year"),
  body("linkedin")
    .optional()
    .custom((val) => !val || val.startsWith("http") || val.startsWith("linkedin"))
    .withMessage("LinkedIn must be a valid URL"),
  body("github")
    .optional()
    .custom((val) => !val || val.startsWith("http") || val.startsWith("github"))
    .withMessage("GitHub must be a valid URL"),
  handleValidation,
];

// ─── Job validators ───────────────────────────────────────────────────────────

const validateJobPost = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("jobType")
    .isIn(["Full-time", "Part-time", "Internship", "Contract", "Freelance"])
    .withMessage("Invalid job type"),
  body("description").trim().notEmpty().withMessage("Job description is required"),
  body("applyLink").trim().notEmpty().withMessage("Apply link is required"),
  body("duration")
    .isInt({ min: 1, max: 365 })
    .withMessage("Duration must be between 1 and 365 days"),
  handleValidation,
];

// ─── Event validators ─────────────────────────────────────────────────────────

const validateEvent = [
  body("title").trim().notEmpty().withMessage("Event title is required"),
  body("date").notEmpty().withMessage("Event date is required"),
  body("time").notEmpty().withMessage("Event time is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("type")
    .isIn(["Webinar", "Conference", "Seminar", "Workshop"])
    .withMessage("Invalid event type"),
  handleValidation,
];

// ─── Donation validators ──────────────────────────────────────────────────────

const validateDonation = [
  body("name").trim().notEmpty().withMessage("Donor name is required"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("amount")
    .isFloat({ min: 1 })
    .withMessage("Amount must be a positive number"),
  body("method")
    .isIn(["UPI", "Bank Transfer", "Card"])
    .withMessage("Invalid payment method"),
  body("transactionId").trim().notEmpty().withMessage("Transaction ID is required"),
  handleValidation,
];

// ─── Suggestion validators ────────────────────────────────────────────────────

const validateSuggestion = [
  body("title").trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title too long"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("description").optional().trim().isLength({ max: 2000 }).withMessage("Description too long"),
  handleValidation,
];

// ─── Mentor validators ────────────────────────────────────────────────────────

const validateMentor = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("role").trim().notEmpty().withMessage("Role/occupation is required"),
  body("company").trim().notEmpty().withMessage("Company/college is required"),
  body("linkedin")
    .notEmpty().withMessage("LinkedIn URL is required")
    .custom((val) => val.startsWith("http") || val.startsWith("linkedin"))
    .withMessage("LinkedIn must be a valid URL"),
  handleValidation,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateProfile,
  validateJobPost,
  validateEvent,
  validateDonation,
  validateSuggestion,
  validateMentor,
  handleValidation,
};
