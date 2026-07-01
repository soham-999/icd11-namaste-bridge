const db = require("../db");

// ===================================
// GLOBAL SEARCH
// ===================================

const globalSearch = async (req, res) => {

  try {

    const q = req.query.q || "";

    const patients = await db.query(
      `
      SELECT
        id,
        name,
        age,
        icd_code
      FROM patients
      WHERE
        name ILIKE $1
        OR icd_code ILIKE $1
      LIMIT 10
      `,
      [`%${q}%`]
    );

    const diagnoses = await db.query(
      `
      SELECT
        id,
        diagnosis,
        icd_code
      FROM diagnoses
      WHERE
        diagnosis ILIKE $1
        OR icd_code ILIKE $1
      LIMIT 10
      `,
      [`%${q}%`]
    );

    res.json({
      success: true,
      patients: patients.rows,
      diagnoses: diagnoses.rows
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
// SEARCH PATIENTS
// ===================================

const searchPatients = async (req, res) => {

  try {

    const q = req.query.q || "";

    const result = await db.query(
      `
      SELECT *
      FROM patients
      WHERE
        name ILIKE $1
      ORDER BY id DESC
      `,
      [`%${q}%`]
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

};

// ===================================
// SEARCH ICD
// ===================================

const searchICD = async (req, res) => {

  try {

    const q = req.query.q || "";

    const result = await db.query(
      `
      SELECT
        symptom,
        icd_code,
        traditional_system,
        confidence_score
      FROM mapping_results
      WHERE
        symptom ILIKE $1
        OR icd_code ILIKE $1
      ORDER BY created_at DESC
      `,
      [`%${q}%`]
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

};

module.exports = {
  globalSearch,
  searchPatients,
  searchICD
};