const client = require("../db");

const findDisease = async (symptom) => {

  try {

    // STEP 1: Always query database first
    const result = await client.query(
      `SELECT * FROM medical_knowledge
       WHERE LOWER(symptom) = LOWER($1)
       LIMIT 1`,
      [symptom]
    );

    // STEP 2: If found in DB → return it
    if (result.rows.length > 0) {

      const row = result.rows[0];

      return {
        icdCode: row.icd_code,
        traditionalMedicine: row.description,
        systemType: row.system_type,
        source: "database"
      };
    }

    // STEP 3: If NOT found → return null (no fallback yet)
    return null;

  } catch (err) {

    console.error("ICD Service Error:", err);

    return null;
  }
};

module.exports = {
  findDisease
};