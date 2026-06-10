const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { mapPatientCondition } = require("../services/mapping/mappingEngine");
const db = require("../db");

/**
 * GENERATE CUSTOM API
 * - Runs mapping engine
 * - Logs request in api_logs
 * - Returns mapping result
 */
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { symptoms, name, age } = req.body;

    // validation
    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Symptoms must be a non-empty array"
      });
    }

    // 1. Run mapping engine
    const mapping = await mapPatientCondition(symptoms);

    // 2. Store request log (FIXED SCHEMA)
    const logResult = await db.query(
      `
      INSERT INTO api_logs
      (endpoint, method, request_body)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [
        "/custom-api/generate",
        "POST",
        JSON.stringify(req.body)
      ]
    );

    // 3. Response
    res.json({
      success: true,
      message: "Custom API generated successfully",
      apiId: logResult.rows[0].id,
      data: mapping
    });

  } catch (err) {
    console.error("Generate API error:", err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;