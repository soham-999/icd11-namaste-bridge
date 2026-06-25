const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const db = require("../db");

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {

      const result = await db.query(`
        SELECT *
        FROM api_logs
        ORDER BY id DESC
        LIMIT 100
      `);

      res.json({
        success: true,
        total: result.rows.length,
        data: result.rows
      });

    } catch (err) {

      console.error(
        "LOG ROUTE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        error: err.message
      });

    }
  }
);

module.exports = router;