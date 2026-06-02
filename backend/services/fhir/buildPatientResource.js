const buildPatientResource = (
  patient,
  observations = []
) => {

  return {

    resourceType: "PatientRecord",

    patient: {
      id: patient?.id || null,
      name: patient?.name || null,
      age: patient?.age || null
    },

    observations,

    createdAt:
      new Date().toISOString()
  };
};

module.exports = {
  buildPatientResource
};