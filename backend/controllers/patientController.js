const client = require("../db");
const { findDisease } = require("../services/icd/icdService");


// ADD PATIENT (HYBRID ICD FLOW)
const addPatient = async (req, res) => {

  try {

    const { name, age, symptom } = req.body;

    // STEP 1: Get ICD classification
    const disease = await findDisease(symptom);

    // STEP 2: Safe extraction
    const icdCode = disease?.icdCode || null;
    const traditionalMedicine = disease?.traditionalMedicine || null;
    const icdSource = disease?.source || "unknown";

    // STEP 3: Insert into database
    const result = await client.query(
      `INSERT INTO patients
      (name, age, symptom, icd_code, traditional_medicine, icd_source)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        name,
        age,
        symptom,
        icdCode,
        traditionalMedicine,
        icdSource
      ]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};


// GET PATIENTS
const getPatients = async (req, res) => {

  try {

    const result = await client.query("SELECT * FROM patients");

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
};


// FINAL EXPORT (FIXED)
module.exports = {
  addPatient,
  getPatients
};