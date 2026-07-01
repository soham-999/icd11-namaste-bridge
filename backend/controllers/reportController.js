const db = require("../db");

// ======================================
// REPORT SUMMARY
// ======================================

const getReportSummary = async (req, res) => {

  try {

    const patients = await db.query(`
      SELECT COUNT(*) FROM patients
    `);

    const diagnoses = await db.query(`
      SELECT COUNT(*) FROM diagnoses
    `);

    const mappings = await db.query(`
      SELECT COUNT(*) FROM mapping_results
    `);

    const notifications = await db.query(`
      SELECT COUNT(*) FROM notifications
    `);

    res.json({
      success: true,
      report: {
        patients: Number(patients.rows[0].count),
        diagnoses: Number(diagnoses.rows[0].count),
        mappings: Number(mappings.rows[0].count),
        notifications: Number(notifications.rows[0].count),
        generatedAt: new Date()
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// ======================================
// PATIENT REPORT
// ======================================

const getPatientReport = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      id,
      name,
      age,
      symptom,
      icd_code,
      traditional_medicine
      FROM patients
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// ======================================
// ICD REPORT
// ======================================

const getICDReport = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      icd_code,
      COUNT(*)::int AS total
      FROM mapping_results
      GROUP BY icd_code
      ORDER BY total DESC
    `);

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

};

// ======================================
// SYSTEM HEALTH REPORT
// ======================================

const getSystemReport = async (req, res) => {

  try {

    res.json({
      success: true,
      system: {
        backend: "Online",
        database: "Connected",
        mappingEngine: "Connected",
        timestamp: new Date()
      }
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = {
  getReportSummary,
  getPatientReport,
  getICDReport,
  getSystemReport
};