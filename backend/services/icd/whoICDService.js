const axios = require("axios");

const TOKEN_URL =
  "https://icdaccessmanagement.who.int/connect/token";

const ICD_BASE_URL =
  "https://id.who.int/icd/release/11/2024-01/mms";

// TOKEN CACHE
let cachedToken = null;
let tokenExpiry = null;

/**
 * GET WHO ACCESS TOKEN
 */
const getAccessToken = async () => {
  
try {

    // reuse valid token
    if (
      cachedToken &&
      tokenExpiry &&
      Date.now() < tokenExpiry
    ) {
      return cachedToken;
    }

    const params = new URLSearchParams();

    params.append(
      "client_id",
      process.env.WHO_CLIENT_ID
    );

    params.append(
      "client_secret",
      process.env.WHO_CLIENT_SECRET
    );

    params.append(
      "grant_type",
      "client_credentials"
    );

    const response = await axios.post(
      TOKEN_URL,
      params,
      {
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
      }
    );

    cachedToken = response.data.access_token;

    // token expiry
    tokenExpiry =
      Date.now() +
      response.data.expires_in * 1000;

    console.log("WHO token refreshed");
u
    return cachedToken;

  } catch (err) {

    console.log("========= TOKEN ERROR =========");

    console.log(
      err.response?.data || err.message
    );

    console.log("================================");

    return null;
  }
};

/**
 * SEARCH ICD-11
 */
const searchICD11 = async (query) => {
  try {

    const token = await getAccessToken();

    // fallback protection
    if (!token) {
      return {
        source: "WHO_ICD11_FALLBACK",
        data: []
      };
    }

    const response = await axios.get(
      `${ICD_BASE_URL}/search`,
      {
        params: {
          q: query
        },

        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Accept-Language": "en",
          "API-Version": "v2"
        },

        timeout: 5000
      }
    );

    // raw debug log
    console.log("========= WHO ICD RAW RESPONSE =========");

    console.log(
      JSON.stringify(response.data, null, 2)
    );

    console.log("========================================");

    const entities =
      response.data?.destinationEntities || [];

    return {
      source: "WHO_ICD11",

  data: entities.map((item) => ({
   icdCode: item.theCode || null,
   title: item.title
    ? item.title.replace(/<[^>]*>/g, "")
    : null,
  id: item.id || null
  }))
  
    };

  } catch (err) {

    console.log("========= ICD SEARCH ERROR =========");

    console.log(
      err.response?.data || err.message
    );

    console.log("====================================");

    return {
      source: "WHO_ICD11_FALLBACK",
      data: []
    };
  }
};

module.exports = {
  searchICD11
};