const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getRecentActivity,
  getActivityStats
} = require("../controllers/activityController");

router.get(
  "/recent",
  authMiddleware,
  getRecentActivity
);

router.get(
  "/stats",
  authMiddleware,
  getActivityStats
);

module.exports = router;