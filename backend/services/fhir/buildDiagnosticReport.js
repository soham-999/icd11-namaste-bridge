const buildDiagnosticReport = (
  observations = []
) => {

  let high = 0;
  let medium = 0;
  let low = 0;

  for (const obs of observations) {

    const risk =
      obs?.clinicalAssessment?.riskLevel;

    if (risk === "HIGH") high++;
    else if (risk === "MEDIUM") medium++;
    else low++;
  }

  const overallRisk =
    high > 0
      ? "HIGH"
      : medium > 0
        ? "MEDIUM"
        : "LOW";

  return {

    resourceType: "DiagnosticReport",

    status: "final",

    summary: {
      totalObservations:
        observations.length,

      highRiskCases: high,
      mediumRiskCases: medium,
      lowRiskCases: low,

      overallRisk
    },

    issued:
      new Date().toISOString()
  };
};

module.exports = {
  buildDiagnosticReport
};