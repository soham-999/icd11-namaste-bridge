const express = require("express");
const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const db = require("../db");


// =====================================
// EXPORT ALL PATIENTS (JSON)
// =====================================

router.get(
  "/patients",
  authMiddleware,
  async (req, res) => {
    try {

      const result = await db.query(
        `
        SELECT
          id,
          name,
          age,
          symptom,
          icd_code,
          traditional_medicine,
          created_at
        FROM patients
        ORDER BY id DESC
        `
      );

      res.json({
        success: true,
        format: "JSON",
        total: result.rows.length,
        data: result.rows
      });

    } catch (err) {

      console.error("EXPORT JSON ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message
      });

    }
  }
);


// =====================================
// EXPORT FHIR BUNDLE
// =====================================

router.get(
  "/fhir",
  authMiddleware,
  async (req, res) => {
    try {

      const result = await db.query(
        `
        SELECT
          id,
          name,
          age,
          icd_code
        FROM patients
        ORDER BY id DESC
        LIMIT 50
        `
      );

      const fhirBundle = {
        resourceType: "Bundle",
        type: "collection",
        total: result.rows.length,
        entry: result.rows.map(patient => ({
          resource: {
            resourceType: "Patient",
            id: String(patient.id),
            name: [
              {
                text: patient.name
              }
            ],
            extension: [
              {
                url: "icdCode",
                valueString: patient.icd_code || "N/A"
              }
            ]
          }
        }))
      };

      res.json({
        success: true,
        format: "FHIR",
        data: fhirBundle
      });

    } catch (err) {

      console.error("EXPORT FHIR ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message
      });

    }
  }
);


// =====================================
// EXPORT TXT
// =====================================

router.get(
  "/txt",
  authMiddleware,
  async (req, res) => {
    try {

      const result = await db.query(
        `
        SELECT
          id,
          name,
          age,
          icd_code
        FROM patients
        ORDER BY id DESC
        LIMIT 50
        `
      );

      const txtOutput =
        result.rows
          .map(
            patient =>
              `Patient ID: ${patient.id}
Name: ${patient.name}
Age: ${patient.age}
ICD Code: ${patient.icd_code || "N/A"}
----------------------------------------`
          )
          .join("\n");

      res.json({
        success: true,
        format: "TXT",
        total: result.rows.length,
        data: txtOutput
      });

    } catch (err) {

      console.error("EXPORT TXT ERROR:", err);

      res.status(500).json({
        success: false,
        error: err.message
      });

    }
  }
);

module.exports = router;