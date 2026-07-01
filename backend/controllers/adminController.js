const db = require("../db");

// ===================================
// ADMIN DASHBOARD
// ===================================

const getAdminDashboard = async (req, res) => {

  try {

    const patients = await db.query(
      `SELECT COUNT(*) FROM patients`
    );

    const users = await db.query(
      `SELECT COUNT(*) FROM users`
    );

    const mappings = await db.query(
      `SELECT COUNT(*) FROM mapping_results`
    );

    const diagnoses = await db.query(
      `SELECT COUNT(*) FROM diagnoses`
    );

    res.json({
      success: true,
      dashboard: {
        totalPatients:
          Number(patients.rows[0].count),

        totalUsers:
          Number(users.rows[0].count),

        totalMappings:
          Number(mappings.rows[0].count),

        totalDiagnoses:
          Number(diagnoses.rows[0].count)
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

// ===================================
// DATABASE STATUS
// ===================================

const getDatabaseStatus = async (req, res) => {

  try {

    await db.query("SELECT NOW()");

    res.json({
      success: true,
      database: "connected"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      database: "disconnected",
      error: err.message
    });

  }

};

// ===================================
// SYSTEM INFO
// ===================================

const getSystemInfo = async (req, res) => {

  res.json({
    success: true,
    node: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });

};

module.exports = {
  getAdminDashboard,
  getDatabaseStatus,
  getSystemInfo
};