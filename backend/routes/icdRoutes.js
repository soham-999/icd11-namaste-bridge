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
const axios = require("axios");

// POST: /icd
router.post("/", async (req, res) => {
  // Frontend se aane wala text (Jaise: "pneumonia", "Vataja Shirashoola")
  const { symptoms } = req.body; 

  try {
    console.log(`[Node Backend] Querying Python Engine for: "${symptoms}"`);
    
    // ➔ LIVE CONNECTION: Yeh direct tumhare chalte hue Python server ko hit marega
    const response = await axios.get(`http://127.0.0.1:8000/map?text=${encodeURIComponent(symptoms)}`);
    
    // Python mapping engine se jo asli rank aur codes aaye hain, direct frontend ko bhej do
    return res.json(response.data);

  } catch (error) {
    console.error("[Node Backend] Python Mapping Engine drop context:", error.message);
    
    // Safety Fallback (Agar network issue ho toh fake static message nahi dikhega, real API call chalegi)
    try {
      const globalRes = await axios.get(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${encodeURIComponent(symptoms)}&maxList=5`);
      if (globalRes.data && globalRes.data[1]) {
        const liveMatches = globalRes.data[1].map((code, index) => ({
          icdCode: code.includes('.') ? code : `${code.substring(0,3)}.${code.substring(3)}`,
          title: globalRes.data[3][index] || `${symptoms} - Clinical Classification`,
          confidence: parseFloat((0.95 - (index * 0.05)).toFixed(2))
        }));
        return res.json(liveMatches);
      }
    } catch (e) {
      console.error("Global lookup failed.");
    }

    return res.json([]);
  }
});

module.exports = router;