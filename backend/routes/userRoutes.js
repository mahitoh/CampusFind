const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
  updatePreferences,
  updatePrivacy,
  updateNotifications,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Routes
router.route("/").get(protect, authorize("admin"), getUsers);

// Profile routes - must come before /:id route
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

// Settings routes - must come before /:id route
router.route("/settings").get(protect, getSettings).put(protect, updateSettings);
router.route("/settings/preferences").put(protect, updatePreferences);
router.route("/settings/privacy").put(protect, updatePrivacy);
router.route("/settings/notifications").put(protect, updateNotifications);

// User routes with ID parameter - must come after specific routes
router
  .route("/:id")
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize("admin"), deleteUser);

module.exports = router;
