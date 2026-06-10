const db = require("../../db");
const { getAyurvedaMapping } = require("../traditional/ayurvedaService");
const { mapSymptoms } = require("../mappingEngineClient");

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

    // Ayurveda mapping
    const ayurveda = getAyurvedaMapping(clean);
    const ayurvedaConfidence =
      ayurveda?.dosha && ayurveda.dosha !== "Unknown" ? 0.75 : 0.4;

    // ICD mapping (FIXED: using mapSymptoms instead of undefined findDisease)
    let icdResult = null;

    try {
      icdResult = await mapSymptoms([clean]);
    } catch (err) {
      console.log("ICD lookup failed:", err.message);
      icdResult = { data: [] };
    }

    const firstICD = icdResult?.data?.[0] || {};
    const icdCode = firstICD?.icdCode || "UNKNOWN";
    const icdSource = firstICD?.source || "mapping-engine";

    const icdConfidence =
      icdCode !== "UNKNOWN" ? 0.85 : 0.3;

    // Fusion
    const fusionScore = calculateFusionScore(
      icdConfidence,
      ayurvedaConfidence
    );

    const riskLevel = getRiskLevel(fusionScore);

    // Final result object
    results.push({
      symptom: clean,

      icd: {
        ...firstICD,
        icdCode,
        source: icdSource,
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

    // Safe async DB write (no blocking, no setImmediate)
    (async () => {
      try {
        await db.query(
          `
          INSERT INTO mapping_results
          (symptom, icd_code, traditional_system, mapping_source, confidence_score, risk_level)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
          [
            clean,
            icdCode,
            ayurveda?.dosha || "UNKNOWN",
            icdSource,
            icdConfidence,
            riskLevel
          ]
        );
      } catch (dbErr) {
        console.log("Mapping save error:", dbErr.message);
      }
    })();
  }

  return {
    total: results.length,
    data: results
  };
};

module.exports = { mapPatientCondition };