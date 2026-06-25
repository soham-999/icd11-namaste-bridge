const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients,
  getPatientWorkspace
} = require("../controllers/patientController");

const authMiddleware =
require("../middleware/authMiddleware");

// CREATE PATIENT
router.post(
  "/",
  authMiddleware,
  addPatient
);

// GET ALL PATIENTS
router.get(
  "/",
  authMiddleware,
  getPatients
);


router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {

      const result = await require("../db").query(
        `
        SELECT *
        FROM patients
        WHERE id = $1
        `,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Patient not found"
        });
      }

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
  }
);


// PATIENT WORKSPACE
router.get(
  "/:id/workspace",
  authMiddleware,
  getPatientWorkspace
);  


const db = require("../db");


router.get(
  "/:id/history",
  authMiddleware,
  async (req, res) => {
    try {

      const patientId = req.params.id;

      const diagnoses = await db.query(
        `
        SELECT *
        FROM diagnoses
        WHERE patient_id = $1
        ORDER BY id DESC
        `,
        [patientId]
      );

      const ledger = await db.query(
        `
        SELECT *
        FROM ledger_logs
        WHERE patient_id = $1
        ORDER BY id DESC
        `,
        [patientId]
      );

      res.json({
        success: true,
        patientId,
        diagnoses: diagnoses.rows,
        ledger: ledger.rows
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message
      });

    }
  }
);

module.exports = router;