const express = require("express");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  markAllAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.route("/").get(getNotifications);

router.route("/read-all").put(markAllAsRead);

router.route("/:id").put(markAsRead).delete(deleteNotification);

module.exports = router;
