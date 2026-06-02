const express = require("express");
const router = express.Router();

// fake example (replace with DB later)
router.get("/stats", (req, res) => {
  res.json({
    totalMappedPatients: 1248,
    pendingMappings: 286,
    searchesToday: 132,
    accuracy: 94.5
  });
});

router.get("/top-diagnoses", (req, res) => {
  res.json([
    { code: "BA00.0", desc: "Essential Hypertension", cases: 320 },
    { code: "CA40.0", desc: "Acute Respiratory Infection", cases: 280 },
    { code: "5A11.0", desc: "Type 2 Diabetes Mellitus", cases: 240 },
    { code: "CA20.1", desc: "Bacterial Pneumonia", cases: 180 }
  ]);
});

module.exports = router;