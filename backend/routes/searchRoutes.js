const express = require("express");
const { searchItems } = require("../controllers/searchController");

const router = express.Router();

// Search route
router.get("/", searchItems);

module.exports = router;
