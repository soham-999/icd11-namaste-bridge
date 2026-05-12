const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients
} = require("../controllers/patientController");

// ROUTES
router.post("/add-patient", addPatient);
router.get("/patients", getPatients);

module.exports = router;