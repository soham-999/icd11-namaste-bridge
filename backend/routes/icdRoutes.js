const express = require("express");
const router = express.Router();

const {
  mapPatientCondition
} = require("../services/mapping/mappingEngine");

const {
  success,
  error
} = require("../utils/response");

// GET
router.get("/:symptom", async (req, res) => {
  try {

    const result =
      await mapPatientCondition([
        req.params.symptom
      ]);

    res.json(success(result));

  } catch (err) {

    res.status(500).json(
      error(err.message)
    );

  }
});

// POST
router.post("/", async (req, res) => {
  try {

    const { symptoms } = req.body;

    if (!symptoms || !symptoms.length) {
      return res
        .status(400)
        .json(error("Symptoms required"));
    }

    const result =
      await mapPatientCondition(symptoms);

    res.json(success(result));

  } catch (err) {

    res.status(500).json(
      error(err.message)
    );

  }
});

module.exports = router;