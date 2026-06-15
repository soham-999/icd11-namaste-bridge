const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const db = require("../db");

router.post(
  "/generate",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        endpoint,
        method,
        rateLimit
      } = req.body;

      if (!name || !endpoint) {
        return res.status(400).json({
          success: false,
          message: "Name and endpoint required"
        });
      }

      const apiKey =
        "sk_live_" +
        Math.random()
          .toString(36)
          .substring(2, 18);

      const generatedApiId =
        "API-" +
        Math.floor(100 + Math.random() * 900);

      const result = await db.query(
        `
        INSERT INTO custom_apis
        (
          api_id,
          name,
          endpoint,
          method,
          rate_limit,
          status
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6
        )
        RETURNING *
        `,
        [
          generatedApiId,
          name,
          endpoint,
          method || "POST",
          rateLimit || "1000/min",
          "Active"
        ]
      );

      res.json({
        success: true,
        apiId: result.rows[0].api_id,
        apiKey,
        data: result.rows[0]
      });

    } catch (err) {
      console.error("Generate API Error:", err);

      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

router.get(
  "/list",
  authMiddleware,
  async (req, res) => {
    try {
      const result = await db.query(
        `
        SELECT *
        FROM custom_apis
        ORDER BY id DESC
        `
      );

      res.json({
        success: true,
        data: result.rows
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

module.exports = router;