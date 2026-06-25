const express = require("express");
const router = express.Router();

const client = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Protect ALL dashboard routes
router.use(authMiddleware);

// =====================================
// DASHBOARD MAIN TELEMETRY
// =====================================

router.get("/stats", async (req, res) => {
  try {

    const patients =
      await client.query(
        "SELECT COUNT(*) FROM patients"
      );

    const mappings =
      await client.query(
        "SELECT COUNT(*) FROM mapping_results"
      );

    const diagnoses =
      await client.query(
        "SELECT COUNT(*) FROM diagnoses"
      );

    res.json({

      success: true,

      gatewayLoad: {
        percentage: 18,
        status: "stable"
      },

      activeTriageCases: {
        count: 0
      },

      unmappedCritical: {
        count: 0
      },

      crosswalksSyncedToday: {
        count: Number(
          mappings.rows[0].count
        )
      },

      interopAccuracy: {
        percentage: 98.4
      },

      validationTurnaround: {
        value: 1.8,
        unit: "minutes"
      },

      wardSyncStatus: {
        synced: 8,
        total: 8,
        status: "green"
      },

      database: {
        totalPatients:
          Number(
            patients.rows[0].count
          ),

        totalMappings:
          Number(
            mappings.rows[0].count
          ),

        totalDiagnoses:
          Number(
            diagnoses.rows[0].count
          )
      }

    });

  } catch (err) {

    console.error(
      "DASHBOARD STATS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// TOP DIAGNOSES
// =====================================

router.get("/top-diagnoses", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT
          diagnosis,
          icd_code,
          COUNT(*) AS cases
        FROM diagnoses
        GROUP BY diagnosis, icd_code
        ORDER BY cases DESC
        LIMIT 10
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// TRAFFIC DATA
// =====================================

router.get("/traffic", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT
          DATE(created_at) AS date,
          COUNT(*) AS value
        FROM mapping_results
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// ICD DISTRIBUTION
// =====================================

router.get("/chapters", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT
          icd_code,
          COUNT(*) AS count
        FROM patients
        WHERE icd_code IS NOT NULL
        GROUP BY icd_code
        ORDER BY count DESC
        LIMIT 10
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// DATABASE CHECK
// =====================================

router.get("/db-check", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public'
        ORDER BY table_name
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// PATIENT COLUMN CHECK
// =====================================

router.get("/patients-columns", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name='patients'
        ORDER BY ordinal_position
      `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

// =====================================
// DIAGNOSES COUNT
// =====================================

router.get("/diagnoses-count", async (req, res) => {

  try {

    const result =
      await client.query(`
        SELECT COUNT(*) AS count
        FROM diagnoses
      `);

    res.json({
      success: true,
      count: Number(
        result.rows[0].count
      )
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
});

module.exports = router;