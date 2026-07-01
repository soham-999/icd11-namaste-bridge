const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getSettings,
  updateSetting,
  resetSettings
} = require("../controllers/settingsController");

router.get(
  "/",
  authMiddleware,
  getSettings
);

router.put(
  "/",
  authMiddleware,
  updateSetting
);

router.delete(
  "/",
  authMiddleware,
  resetSettings
);

module.exports = router;