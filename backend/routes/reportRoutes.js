const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getReportSummary,
  getPatientReport,
  getICDReport,
  getSystemReport
} = require("../controllers/reportController");

router.get(
  "/summary",
  authMiddleware,
  getReportSummary
);

router.get(
  "/patients",
  authMiddleware,
  getPatientReport
);

router.get(
  "/icd",
  authMiddleware,
  getICDReport
);

router.get(
  "/system",
  authMiddleware,
  getSystemReport
);

module.exports = router;