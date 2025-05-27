const express = require("express");
const {
  createClaim,
  getItemClaims,
  getUserClaims,
  getReceivedClaims,
  updateClaimStatus,
  completeClaim,
  deleteClaim,
} = require("../controllers/claimController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router.route("/").post(createClaim);

router.route("/my-claims").get(getUserClaims);

router.route("/received-claims").get(getReceivedClaims);

router.route("/item/:itemId").get(getItemClaims);

router.route("/:id").put(updateClaimStatus).delete(deleteClaim);

router.route("/:id/complete").put(completeClaim);

module.exports = router;
