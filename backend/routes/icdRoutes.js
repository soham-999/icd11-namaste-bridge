/*const express = require("express");
const router = express.Router();

const {
  mapPatientCondition
} = require("../services/mapping/mappingEngine");

const {
  success,
  error
} = require("../utils/response");

// GET
router.get("/:symptom", async (req, res) => {
  try {

    const result =
  await mapPatientCondition([
    req.params.symptom
  ]);

console.log(
  "FINAL RESPONSE:",
  JSON.stringify(result, null, 2)
);

res.json(success(result));

  } catch (err) {

  console.error(
    "ICD ROUTE ERROR:",
    err
  );

  res.status(500).json(
    error(err.message)
  );

}
});

// POST
router.post("/", async (req, res) => {
  try {

    const { symptoms } = req.body;

    if (!symptoms || !symptoms.length) {
      return res
        .status(400)
        .json(error("Symptoms required"));
    }

   const result =
  await mapPatientCondition(symptoms);

console.log(
  "FINAL RESPONSE:",
  JSON.stringify(result, null, 2)
);

res.json(success(result));

  } catch (err) {

  console.error(
    "ICD ROUTE ERROR:",
    err
  );

  res.status(500).json(
    error(err.message)
  );

}
});

module.exports = router;*/
const express = require("express");
const router = express.Router();
const db = require("../db");

// FRONTEND SE AAYI REQUEST KO HANDLE KARNE KE LIYE
router.post("/", async (req, res) => {
  try {
    const { symptoms } = req.body; // Frontend se text aa raha hai

    if (!symptoms) {
      return res.json([]);
    }

    // TERI TABLE KE ASALI COLUMNS KE MUTABIK QUERY:
    // Hum 'disease_name' aur 'diagnosis' columns ke andar user ka text search kar rahe hain
    const query = `
      SELECT * FROM icd_mappings 
      WHERE disease_name ILIKE $1 
      OR diagnosis ILIKE $1;
    `;
    
    const values = [`%${symptoms}%`];
    const result = await db.query(query, values);

    console.log(`Search hit for: ${symptoms}. Found ${result.rows.length} rows.`);

    // Frontend ko direct pure database rows ka array bhej rahe hain
    res.json(result.rows);

  } catch (err) {
    console.error("Error in /icd route:", err.message);
    res.status(500).json([]);
  }
});

module.exports = router;