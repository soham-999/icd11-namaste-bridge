const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ PROTECTED ROUTES
router.post("/add-patient", authMiddleware, addPatient);
router.get("/", authMiddleware, getPatients);

module.exports = router;