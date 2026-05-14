const client = require("../db");
const { mapPatientCondition } = require("../services/mapping/mappingEngine");

// ADD PATIENT
const addPatient = async (req, res) => {
  try {
    const { name, age, symptoms } = req.body;

    const mappingResult = await mapPatientCondition(symptoms);

    const results = mappingResult?.data || [];

    const firstMapping = results?.[0];

    const icdCode = firstMapping?.icd?.icdCode || null;
    const icdSource = firstMapping?.icd?.source || "unknown";
    const traditionalMedicine =
      firstMapping?.ayurveda?.description || null;

    const result = await client.query(
      `INSERT INTO patients
      (name, age, symptom, icd_code, traditional_medicine, icd_source)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        name,
        age,
        JSON.stringify(symptoms),
        icdCode,
        traditionalMedicine,
        icdSource
      ]
    );

    // EHR RESPONSE
    let high = 0, medium = 0, low = 0;

    for (let r of results) {
      if (r?.fusion?.risk === "HIGH") high++;
      else if (r?.fusion?.risk === "MEDIUM") medium++;
      else low++;
    }

    const overallRisk =
      high > 0 ? "HIGH" :
      medium > 0 ? "MEDIUM" : "LOW";

    res.json({
      success: true,
      message: "Patient added with SIH-grade EHR diagnostic system",

      patient: result.rows[0],

      ehrReport: {
        summary: {
          totalSymptoms: results.length,
          highRiskCases: high,
          mediumRiskCases: medium,
          lowRiskCases: low,
          overallRiskLevel: overallRisk
        },

        clinicalMapping: results
      }
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

module.exports = {
  addPatient,
  getPatients
};