const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  globalSearch,
  searchPatients,
  searchICD
} = require("../controllers/searchController");

router.get(
  "/",
  authMiddleware,
  globalSearch
);

router.get(
  "/patients",
  authMiddleware,
  searchPatients
);

router.get(
  "/icd",
  authMiddleware,
  searchICD
);

module.exports = router;