const express = require("express");
const router = express.Router();

const { findDisease } = require("../services/icd/icdService");
const { success, error } = require("../utils/response");

// ✅ GET (for testing)
router.get("/:symptom", async (req, res) => {
  try {
    const result = await findDisease(req.params.symptom);

    if (!result) {
      return res.status(404).json(error("No matching ICD record found"));
    }

    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

// ✅ POST (FOR FRONTEND INTEGRATION - IMPORTANT)
router.post("/", async (req, res) => {
  try {
    const symptoms = req.body.symptoms;

    if (!symptoms || !symptoms.length) {
      return res.status(400).json(error("Symptoms required"));
    }

    const result = await findDisease(symptoms[0]); // simple mapping

    if (!result) {
      return res.status(404).json(error("No matching ICD record found"));
    }

    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

module.exports = router;