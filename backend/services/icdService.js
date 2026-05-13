const mockDB = [
  {
    symptom: "fever",
    icdCode: "TM001",
    description: "Pitta imbalance",
    source: "mock"
  },
  {
    symptom: "headache",
    icdCode: "TM002",
    description: "Vata disturbance",
    source: "mock"
  },
  {
    symptom: "cough",
    icdCode: "TM003",
    description: "Kapha imbalance",
    source: "mock"
  }
];

// CORE FUNCTION (future: will call WHO ICD-11 API)
const findDisease = async (symptom) => {

  const result = mockDB.find(
    item => item.symptom.toLowerCase() === symptom.toLowerCase()
  );

  return result || null;
};

module.exports = {
  findDisease
};