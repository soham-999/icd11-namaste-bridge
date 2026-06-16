const express = require("express");
const router = express.Router();

const {
  mapPatientCondition
} = require("../services/mapping/mappingEngine");

router.post("/process", async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        error: "records array required"
      });
    }

    const results = [];

    for (const record of records) {
      const mapped =
        await mapPatientCondition([record]);

      results.push(mapped);
    }

    res.json({
      success: true,
      total: results.length,
      results
    });

  } catch (err) {
    console.error(
      "BATCH ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;