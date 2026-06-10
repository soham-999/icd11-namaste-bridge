const axios = require("axios");

const MAP_ENGINE_URL = "http://localhost:8000/v1/map";

/**
 * Calls the Python Mapping Engine instead of local ICD logic
 */
const mapSymptoms = async (symptoms, sources = null) => {
  try {
    const response = await axios.post(MAP_ENGINE_URL, {
      symptoms,
      sources
    });

    return response.data;
  } catch (error) {
    console.error("Mapping Engine Error:", error.message);

    return {
      request_id: null,
      engine_version: null,
      total: 0,
      data: [],
      error: "mapping_engine_unreachable"
    };
  }
};

module.exports = {
  mapSymptoms
};