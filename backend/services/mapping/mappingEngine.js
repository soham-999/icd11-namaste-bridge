const { mapSymptoms } = require("../mappingEngineClient");

const mapPatientCondition = async (symptoms = []) => {
  if (!Array.isArray(symptoms)) {
    symptoms = [symptoms];
  }

  const response = await mapSymptoms(symptoms);

  console.log(
    "PYTHON RESPONSE:",
    JSON.stringify(response, null, 2)
  );

  const results = (response.data || []).map(
    (item) => ({
      symptom: item.symptom || "",

      icd: {
        icdCode:
          item.icd?.icd_code ||
          "UNKNOWN",

        description:
          item.icd?.description ||
          "No description",

        source:
          item.icd?.source ||
          "mapping-engine",

        confidence:
          item.icd?.confidence ||
          0
      },

      traditional:
        item.traditional || null,

      fusion: {
        score:
          item.fusion?.score || 0,

        risk:
          item.fusion?.risk || "LOW"
      }
    })
  );

  return {
    total: results.length,
    data: results
  };
};

module.exports = {
  mapPatientCondition
};