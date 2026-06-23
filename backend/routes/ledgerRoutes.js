const express = require("express");
const router = express.Router();

const db = require("../db");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/test",
  authMiddleware,
  roleMiddleware("doctor", "admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Ledger access granted",
      user: req.user
    });
  }
);

router.post(
  "/commit",
  authMiddleware,
  roleMiddleware("doctor", "admin"),
  async (req, res) => {
    try {

      const {
        patient_id,
        action,
        details,
        status
      } = req.body;

      const result = await db.query(
        `
        INSERT INTO ledger_logs
        (
          patient_id,
          user_id,
          action,
          details,
          status
        )
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
          patient_id,
          req.user.id,
          action,
          details,
          status
        ]
      );

      res.json({
        success: true,
        data: result.rows[0]
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  }
);

router.get(
  "/history",
  authMiddleware,
  roleMiddleware("doctor", "admin"),
  async (req, res) => {
    try {

      const result = await db.query(
        `
        SELECT
          id,
          patient_id,
          user_id,
          action,
          details,
          status,
          created_at
        FROM ledger_logs
        ORDER BY created_at DESC
        LIMIT 100
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
        message: err.message
      });

    }
  }
);

module.exports = router;