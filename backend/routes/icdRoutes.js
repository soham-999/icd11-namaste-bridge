const express = require("express");
const router = express.Router();

const { findDisease } = require("../services/icd/icdService");
const { success, error } = require("../utils/response");

router.get("/:symptom", async (req, res) => {

  try {

    const symptom = req.params.symptom;

    const result = await findDisease(symptom);

    if (!result) {
      return res.status(404).json(
        error("No matching ICD record found")
      );
    }

    res.json(success(result));

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;