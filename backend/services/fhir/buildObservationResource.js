const buildObservationResource = (
  symptom,
  icd,
  ayurveda,
  fusion
) => {

  return {

    resourceType: "Observation",

    status: "final",

    code: {
      text: symptom
    },

    icd11: {
      system: "WHO-ICD-11",
      code: icd?.icdCode || null,
      display: icd?.title || null
    },

    traditionalMedicine: {
      system: "AYURVEDA",
      description:
        ayurveda?.description || null
    },

    clinicalAssessment: {
      riskLevel:
        fusion?.risk || "LOW",

      confidence:
        fusion?.confidence || 0.2
    },

    effectiveDateTime:
      new Date().toISOString()
  };
};

module.exports = {
  buildObservationResource
};