const { getAyurvedaMapping } = require("../traditional/ayurvedaService");
const { findDisease } = require("../icd/icdService");

const mapPatientCondition = async (symptoms = []) => {
  if (!Array.isArray(symptoms)) {
    symptoms = [symptoms];
  }

  const results = [];

  for (let symptom of symptoms) {
    const clean = symptom.toLowerCase();

    const ayurveda = getAyurvedaMapping(clean);
    const icd = await findDisease(clean);

    results.push({
      symptom: clean,
      ayurveda: ayurveda,
      icd: icd || {
        icdCode: "UNKNOWN",
        description: "No ICD match"
      }
    });
  }

  return {
    total: results.length,
    data: results
  };
};

module.exports = { mapPatientCondition };