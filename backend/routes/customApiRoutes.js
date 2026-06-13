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
    const {
  name,
  endpoint,
  method,
  rateLimit
} = req.body;

// validation
if (!name || !endpoint) {
  return res.status(400).json({
    success: false,
    message: "Name and endpoint are required"
  });
}

// create generated api key
const apiKey =
  "sk_live_" +
  Math.random().toString(36).substring(2, 18);

// dummy mapping response
const mapping = {
  name,
  endpoint,
  method,
  rateLimit,
  apiKey
};

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