const express = require("express");
const router = express.Router();
const client = require("../db");

// Dashboard Stats
router.get("/stats", (req, res) => {
  res.json({
    totalMappedPatients: 1248,
    pendingMappings: 286,
    searchesToday: 132,
    accuracy: 94.5,
  });
});

// Top Diagnoses
router.get("/top-diagnoses", (req, res) => {
  res.json([
    {
      code: "BA00.0",
      desc: "Essential Hypertension",
      cases: 320,
    },
    {
      code: "CA40.0",
      desc: "Acute Respiratory Infection",
      cases: 280,
    },
    {
      code: "5A11.0",
      desc: "Type 2 Diabetes Mellitus",
      cases: 240,
    },
    {
      code: "CA20.1",
      desc: "Bacterial Pneumonia",
      cases: 180,
    },
  ]);
});

// Traffic Chart Data
router.get("/traffic", (req, res) => {
  res.json([
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 240 },
  ]);
});

// ICD Chapter Distribution
router.get("/chapters", (req, res) => {
  res.json([
    {
      chapter: "Infectious Diseases",
      count: 320,
    },
    {
      chapter: "Endocrine",
      count: 180,
    },
    {
      chapter: "Respiratory",
      count: 140,
    },
  ]);
});

// Database Check
router.get("/db-check", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Patients Table Columns
router.get("/patients-columns", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='patients'
      ORDER BY ordinal_position
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Diagnoses Count
router.get("/diagnoses-count", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT COUNT(*) FROM diagnoses"
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;