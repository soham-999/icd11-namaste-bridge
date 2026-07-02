const db = require("../db");

// =====================================
// GET SETTINGS
// =====================================

const getSettings = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT *
      FROM settings
      LIMIT 1
    `);

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// =====================================
// UPDATE SETTINGS
// =====================================

const updateSetting = async (req, res) => {

  try {

    const {

      hospital_name,
      hospital_code,
      default_system,
      enable_notifications,
      enable_blockchain,
      enable_mapping_engine

    } = req.body;

    await db.query(

      `
      UPDATE settings
      SET
        hospital_name = $1,
        hospital_code = $2,
        default_system = $3,
        enable_notifications = $4,
        enable_blockchain = $5,
        enable_mapping_engine = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      `,

      [

        hospital_name,
        hospital_code,
        default_system,
        enable_notifications,
        enable_blockchain,
        enable_mapping_engine

      ]

    );

    res.json({

      success: true,
      message: "Settings updated successfully"

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};

// =====================================
// RESET SETTINGS
// =====================================

const resetSettings = async (req, res) => {

  try {

    await db.query(

      `
      UPDATE settings
      SET
        hospital_name = 'NAMASTE Hospital',
        hospital_code = 'NMST-001',
        default_system = 'ICD-11',
        enable_notifications = TRUE,
        enable_blockchain = TRUE,
        enable_mapping_engine = TRUE,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      `

    );

    res.json({

      success: true,
      message: "Settings reset successfully"

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};

module.exports = {

  getSettings,
  updateSetting,
  resetSettings

};