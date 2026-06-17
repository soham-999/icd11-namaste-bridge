const axios = require("axios");

const BASE_URL = "http://localhost:8000/v1";

/**
 * Core client for Python Mapping Engine
 */
const mapSymptoms = async (symptoms, sources = null, requestId = null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/map`,
      {
        symptoms,
        sources
      },
      {
        headers: requestId ? { "x-request-id": requestId } : {}
      }
    );

    return response.data;
  }catch (error) {

  console.log(
    "Mapping Engine call failed:"
  );

  console.log(
    "FULL ERROR:"
  );

  console.log(error);

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