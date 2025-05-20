const { body, validationResult } = require("express-validator");

exports.validateItemInput = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "Electronics",
      "Clothing",
      "Books",
      "Accessories",
      "Documents",
      "Other",
    ])
    .withMessage("Invalid category"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Lost", "Found", "Claimed", "Returned"])
    .withMessage("Invalid status"),
  body("location").notEmpty().withMessage("Location is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Invalid date format"),
];

exports.validateAuthInput = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please include a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.validateRegistrationInput = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  ...exports.validateAuthInput,
];

// Middleware to handle validation results
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }
  next();
};
