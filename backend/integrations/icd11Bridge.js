const axios = require("axios");

// This will later connect to WHO ICD-11 API
const searchICD11 = async (query) => {

  try {

    // Placeholder for real WHO API call
    // We simulate structure for now

    return {
      source: "ICD11-WHO",
      query: query,
      result: "External ICD lookup not connected yet"
    };

  } catch (err) {

    return {
      error: err.message
    };

  }

};

module.exports = {
  searchICD11
};