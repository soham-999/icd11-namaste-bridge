const axios = require("axios");

/**
 * WHO ICD-11 Service Layer (SIH-ready scaffold)
 * - Proper API structure
 * - Safe fallback behavior
 * - Ready for OAuth token integration
 */

const WHO_BASE_URL = "https://id.who.int/icd";

/**
 * NOTE:
 * WHO ICD-11 API requires OAuth2 token.
 * Without token → API will fail → fallback will be used.
 */

const fetchICD11 = async (symptom) => {
  try {
    const query = symptom.toLowerCase().trim();

    // WHO ICD-11 Search Endpoint (correct base structure)
    const url = `${WHO_BASE_URL}/entity/search?q=${encodeURIComponent(query)}`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",

        // 🔒 REQUIRED FOR REAL API (enable later)
        // Authorization: `Bearer ${process.env.WHO_TOKEN}`,

        // WHO API version header (important for production)
        "API-Version": "v2"
      },
      timeout: 5000
    });

    const data = response.data;

    // Normalize response safely
    const entity = data?.destinationEntities?.[0];

    if (!entity) return null;

    return {
      source: "WHO_ICD11",
      icdCode: entity?.theCode || null,
      description: entity?.title || null,
      raw: data
    };

  } catch (err) {
    console.log("WHO API failed → fallback mode:", err.message);

    return null;
  }
};

module.exports = {
  fetchICD11
};