const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markNotificationRead
} = require("../controllers/notificationController");

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationRead
);

module.exports = router;