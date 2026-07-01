const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
  getAdminDashboard,
  getDatabaseStatus,
  getSystemInfo
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminDashboard
);

router.get(
  "/database",
  authMiddleware,
  roleMiddleware("admin"),
  getDatabaseStatus
);

router.get(
  "/system",
  authMiddleware,
  roleMiddleware("admin"),
  getSystemInfo
);

module.exports = router;