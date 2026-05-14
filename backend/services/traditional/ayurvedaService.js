const getAyurvedaMapping = (symptom) => {
  const s = symptom?.toLowerCase() || "";

  if (s.includes("fever")) {
    return { dosha: "Pitta", description: "Pitta aggravation suspected" };
  }

  if (s.includes("cough")) {
    return { dosha: "Kapha", description: "Kapha imbalance suspected" };
  }

  return { dosha: "Vata", description: "Vata imbalance possible" };
};

module.exports = { getAyurvedaMapping };