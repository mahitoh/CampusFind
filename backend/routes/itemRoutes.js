const express = require("express");
const {
  getItems,
  getItem,
  getUserItems,
  createItem,
  updateItem,
  deleteItem,
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

router
  .route("/:id")
  .get(getItem)
  .put(protect, upload.array("images", 5), updateItem)
  .delete(protect, deleteItem);

module.exports = router;
