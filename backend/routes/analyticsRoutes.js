const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {

getAnalyticsOverview,
getDailyMappings,
getRiskDistribution,
getSourceDistribution,
getTopICDCodes

} = require("../controllers/analyticsController");

router.get(
"/overview",
authMiddleware,
getAnalyticsOverview
);

router.get(
"/daily-mappings",
authMiddleware,
getDailyMappings
);

router.get(
"/risk-distribution",
authMiddleware,
getRiskDistribution
);

router.get(
"/source-distribution",
authMiddleware,
getSourceDistribution
);

router.get(
"/top-icd",
authMiddleware,
getTopICDCodes
);

module.exports = router;