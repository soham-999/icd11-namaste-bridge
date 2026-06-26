const express = require("express");
const router = express.Router();

const client = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================
// PROTECT ALL DASHBOARD ROUTES
// =====================================

router.use(authMiddleware);

// =====================================
// DASHBOARD MAIN TELEMETRY
// =====================================

router.get("/stats", async (req, res) => {

  try {

    const patients = await client.query(
      "SELECT COUNT(*) FROM patients"
    );

    const mappings = await client.query(
      "SELECT COUNT(*) FROM mapping_results"
    );

    const diagnoses = await client.query(
      "SELECT COUNT(*) FROM diagnoses"
    );

    const highRisk = await client.query(`
      SELECT COUNT(*) AS count
      FROM mapping_results
      WHERE risk_level = 'HIGH'
    `);

    const todayMappings = await client.query(`
      SELECT COUNT(*) AS count
      FROM mapping_results
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    const avgConfidence = await client.query(`
      SELECT AVG(confidence_score::numeric) AS avg
      FROM mapping_results
    `);

    const accuracy =
      avgConfidence.rows[0].avg
        ? Number(avgConfidence.rows[0].avg) * 100
        : 0;

    res.json({

      success: true,

      gatewayLoad: {
        percentage: 18,
        status: "stable"
      },

      activeTriageCases: {
        count: Number(highRisk.rows[0].count)
      },

      unmappedCritical: {
        count: 0
      },

      crosswalksSyncedToday: {
        count: Number(todayMappings.rows[0].count)
      },

      interopAccuracy: {
        percentage: Number(accuracy.toFixed(2))
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
          Number(patients.rows[0].count),

        totalMappings:
          Number(mappings.rows[0].count),

        totalDiagnoses:
          Number(diagnoses.rows[0].count)

      }

    });

  }
  catch (err) {

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

    const result = await client.query(`
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

  }
  catch (err) {

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

    const result = await client.query(`
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

  }
  catch (err) {

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

    const result = await client.query(`
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

  }
  catch (err) {

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

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    res.json({
      success: true,
      data: result.rows
    });

  }
  catch (err) {

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

    const result = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'patients'
      ORDER BY ordinal_position
    `);

    res.json({
      success: true,
      data: result.rows
    });

  }
  catch (err) {

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

    const result = await client.query(`
      SELECT COUNT(*) AS count
      FROM diagnoses
    `);

    res.json({
      success: true,
      count: Number(result.rows[0].count)
    });

  }
  catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// =====================================
// RECENT MAPPINGS
// =====================================

router.get("/recent-mappings/:patientId", async (req, res) => {

  try {

    const patientId = req.params.patientId;

    const result = await client.query(
      `
      SELECT
        id,
        patient_id,
        symptom,
        icd_code,
        traditional_system,
        mapping_source,
        confidence_score,
        risk_level,
        created_at
      FROM mapping_results
      WHERE patient_id = $1
      ORDER BY created_at DESC
      `,
      [patientId]
    );

    res.json({
      success: true,
      patientId,
      total: result.rows.length,
      mappings: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// =====================================
// RECENT PATIENTS
// =====================================

router.get("/recent-patients", async (req, res) => {

  try {

    const result = await client.query(`
      SELECT
        id,
        name,
        age,
        icd_code,
        traditional_medicine,
        icd_source
      FROM patients
      ORDER BY id DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      total: result.rows.length,
      patients: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// =====================================
// PATIENT SUMMARY
// =====================================

router.get("/patient-summary/:patientId", async (req, res) => {

  try {

    const patientId = req.params.patientId;

    const patient = await client.query(
      `
      SELECT
        id,
        name,
        age,
        icd_code,
        traditional_medicine,
        icd_source
      FROM patients
      WHERE id = $1
      `,
      [patientId]
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found"
      });
    }

    const diagnosisCount = await client.query(
      `
      SELECT COUNT(*) AS total
      FROM diagnoses
      WHERE patient_id = $1
      `,
      [patientId]
    );

    const mappingCount = await client.query(
      `
      SELECT COUNT(*) AS total
      FROM mapping_results
      WHERE patient_id = $1
      `,
      [patientId]
    );

    res.json({
      success: true,
      patient: patient.rows[0],
      summary: {
        totalDiagnoses: Number(diagnosisCount.rows[0].total),
        totalMappings: Number(mappingCount.rows[0].total)
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

// =====================================
// SYSTEM HEALTH
// =====================================

router.get("/system-health", async (req, res) => {

  try {

    const patients = await client.query(
      "SELECT COUNT(*) AS total FROM patients"
    );

    const diagnoses = await client.query(
      "SELECT COUNT(*) AS total FROM diagnoses"
    );

    const mappings = await client.query(
      "SELECT COUNT(*) AS total FROM mapping_results"
    );

    const latestMapping = await client.query(`
      SELECT created_at
      FROM mapping_results
      ORDER BY created_at DESC
      LIMIT 1
    `);

    res.json({

      success: true,

      server: "online",

      database: "connected",

      totals: {

        patients:
          Number(patients.rows[0].total),

        diagnoses:
          Number(diagnoses.rows[0].total),

        mappings:
          Number(mappings.rows[0].total)

      },

      lastMapping:
        latestMapping.rows.length
          ? latestMapping.rows[0].created_at
          : null

    });

  } catch (err) {

    res.status(500).json({

      success: false,

      server: "online",

      database: "error",

      error: err.message

    });

  }

});


module.exports = router;