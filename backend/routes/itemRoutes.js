const express = require("express");
const {
  getItems,
  getItem,
  getUserItems,
  createItem,
  updateItem,
  deleteItem,
  getPendingItems,
  getAllItemsAdmin,
  approveItem,
  rejectItem,
} = require("../controllers/itemController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Routes
router
  .route("/")
  .get(getItems)
  .post(protect, upload.array("images", 5), createItem);

router.route("/my-items").get(protect, getUserItems);

// Admin routes
router
  .route("/admin/pending")
  .get(protect, authorize("admin"), getPendingItems);

router.route("/admin/all").get(protect, authorize("admin"), getAllItemsAdmin);

router
  .route("/admin/:id/approve")
  .put(protect, authorize("admin"), approveItem);

router.route("/admin/:id/reject").put(protect, authorize("admin"), rejectItem);

router
  .route("/:id")
  .get(getItem)
  .put(protect, upload.array("images", 5), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
