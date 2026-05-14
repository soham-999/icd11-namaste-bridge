const findDisease = async (symptom) => {
  const mockDB = [
    {
      symptom: "fever",
      icdCode: "R50",
      description: "Fever of unknown origin",
      source: "mock"
    },
    {
      symptom: "cough",
      icdCode: "R05",
      description: "Cough",
      source: "mock"
    },
    {
      symptom: "headache",
      icdCode: "R51",
      description: "Headache",
      source: "mock"
    }
  ];

  return mockDB.find(
    item => item.symptom.toLowerCase() === symptom.toLowerCase()
  );
};

module.exports = { findDisease };