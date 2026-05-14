const { fetchICD11 } = require("./whoICDService");

// fallback mock database
const mockDB = [
  { symptom: "fever", icdCode: "TM001", description: "Pitta imbalance", source: "mock" },
  { symptom: "headache", icdCode: "TM002", description: "Vata disturbance", source: "mock" },
  { symptom: "cough", icdCode: "TM003", description: "Kapha imbalance", source: "mock" }
];

const findDisease = async (symptom) => {
  try {
    const clean = symptom.toLowerCase();

    // 1. WHO ICD-11 API attempt
    const whoResult = await fetchICD11(clean);

    if (whoResult) {
      return {
        ...whoResult,
        source: "who-icd11"
      };
    }

    // 2. fallback mock search
    const mockResult = mockDB.find(
      item => item.symptom.toLowerCase() === clean
    );

    if (mockResult) {
      return mockResult;
    }

    // 3. final fallback
    return {
      symptom: clean,
      icdCode: "UNKNOWN",
      description: "No match found",
      source: "fallback"
    };

  } catch (err) {
    return {
      symptom,
      icdCode: "ERROR",
      description: err.message,
      source: "error"
    };
  }
};

module.exports = { findDisease };