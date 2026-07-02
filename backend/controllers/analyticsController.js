const db = require("../db");

// =====================================
// OVERVIEW
// =====================================

const getAnalyticsOverview = async (req, res) => {

  try {

    const patients =
      await db.query("SELECT COUNT(*) FROM patients");

    const mappings =
      await db.query("SELECT COUNT(*) FROM mapping_results");

    const diagnoses =
      await db.query("SELECT COUNT(*) FROM diagnoses");

    const users =
      await db.query("SELECT COUNT(*) FROM users");

    res.json({
      success: true,
      analytics: {
        totalPatients: Number(patients.rows[0].count),
        totalMappings: Number(mappings.rows[0].count),
        totalDiagnoses: Number(diagnoses.rows[0].count),
        totalUsers: Number(users.rows[0].count)
      }
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// DAILY MAPPINGS
// =====================================

const getDailyMappings = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      DATE(created_at) AS date,
      COUNT(*)::int AS value
      FROM mapping_results
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// RISK DISTRIBUTION
// =====================================

const getRiskDistribution = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      risk_level,
      COUNT(*)::int AS count
      FROM mapping_results
      GROUP BY risk_level
      ORDER BY risk_level
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// SOURCE DISTRIBUTION
// =====================================

const getSourceDistribution = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      mapping_source,
      COUNT(*)::int AS count
      FROM mapping_results
      GROUP BY mapping_source
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =====================================
// TOP ICD CODES
// =====================================

const getTopICDCodes = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
      icd_code,
      COUNT(*)::int AS count
      FROM mapping_results
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
      message: err.message
    });

  }

};


module.exports = {

  getAnalyticsOverview,
  getDailyMappings,
  getRiskDistribution,
  getSourceDistribution,
  getTopICDCodes

};