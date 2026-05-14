const { getAyurvedaMapping } = require("../traditional/ayurvedaService");
const { findDisease } = require("../icd/icdService");

// FUSION SCORE CALCULATION
const calculateFusionScore = (icdConf, ayurvedaConf) => {
  return (icdConf * 0.6) + (ayurvedaConf * 0.4);
};

const getRiskLevel = (score) => {
  if (score >= 0.75) return "HIGH";
  if (score >= 0.5) return "MEDIUM";
  return "LOW";
};

const mapPatientCondition = async (symptoms = []) => {
  if (!Array.isArray(symptoms)) {
    symptoms = [symptoms];
  }

  const results = [];

  for (let symptom of symptoms) {
    const clean = symptom.toLowerCase().trim();

    const ayurveda = getAyurvedaMapping(clean);
    const ayurvedaConfidence =
      ayurveda?.dosha !== "Unknown" ? 0.75 : 0.4;

    const icd = await findDisease(clean);
    const icdConfidence =
      icd?.icdCode && icd.icdCode !== "UNKNOWN" ? 0.85 : 0.3;

    const fusionScore = calculateFusionScore(
      icdConfidence,
      ayurvedaConfidence
    );

    const riskLevel = getRiskLevel(fusionScore);

    results.push({
      symptom: clean,

      icd: {
        ...icd,
        confidence: icdConfidence
      },

      ayurveda: {
        ...ayurveda,
        confidence: ayurvedaConfidence
      },

      fusion: {
        score: Number(fusionScore.toFixed(2)),
        risk: riskLevel
      }
    });
  }

  return {
    total: results.length,
    data: results
  };
};

module.exports = { mapPatientCondition };