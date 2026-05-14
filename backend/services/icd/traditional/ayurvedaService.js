const getAyurvedaMapping = (symptom) => {
  const mapping = [
    {
      symptom: "fever",
      dosha: "Pitta",
      description: "Heat imbalance"
    },
    {
      symptom: "cough",
      dosha: "Kapha",
      description: "Mucus imbalance"
    },
    {
      symptom: "headache",
      dosha: "Vata",
      description: "Nervous imbalance"
    }
  ];

  return mapping.find(
    item => item.symptom.toLowerCase() === symptom.toLowerCase()
  ) || {
    symptom,
    dosha: "Unknown",
    description: "No mapping found"
  };
};

module.exports = { getAyurvedaMapping };