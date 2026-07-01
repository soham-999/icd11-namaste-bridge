const db = require("../db");

// ===============================
// RECENT ACTIVITY FEED
// ===============================

const getRecentActivity = async (req, res) => {

  try {

    const activities = [];

    // -----------------------------
    // Recent Patients
    // -----------------------------
    try {

      const patients = await db.query(`
        SELECT
          id,
          name
        FROM patients
        ORDER BY id DESC
        LIMIT 5
      `);

      patients.rows.forEach((patient) => {

        activities.push({

          type: "patient",
          icon: "user",
          title: "New Patient Added",
          description: patient.name,
          created_at: new Date()

        });

      });

    } catch (err) {}



    // -----------------------------
    // Recent ICD Mappings
    // -----------------------------
    try {

      const mappings = await db.query(`
        SELECT
          symptom,
          icd_code,
          mapping_source,
          created_at
        FROM mapping_results
        ORDER BY created_at DESC
        LIMIT 5
      `);

      mappings.rows.forEach((mapping) => {

        activities.push({

          type: "mapping",
          icon: "activity",
          title: "ICD Mapping Generated",
          description: `${mapping.symptom} → ${mapping.icd_code}`,
          source: mapping.mapping_source,
          created_at: mapping.created_at

        });

      });

    } catch (err) {}



    // -----------------------------
    // Ledger Activity
    // -----------------------------
    try {

      const ledger = await db.query(`
        SELECT
          action,
          created_at
        FROM ledger_logs
        ORDER BY created_at DESC
        LIMIT 5
      `);

      ledger.rows.forEach((item) => {

        activities.push({

          type: "ledger",
          icon: "database",
          title: "Ledger Updated",
          description: item.action,
          created_at: item.created_at

        });

      });

    } catch (err) {}



    // -----------------------------
    // Notifications
    // -----------------------------
    try {

      const notifications = await db.query(`
        SELECT
          title,
          message,
          created_at
        FROM notifications
        ORDER BY created_at DESC
        LIMIT 5
      `);

      notifications.rows.forEach((item) => {

        activities.push({

          type: "notification",
          icon: "bell",
          title: item.title,
          description: item.message,
          created_at: item.created_at

        });

      });

    } catch (err) {}



    // -----------------------------
    // Sort Latest First
    // -----------------------------
    activities.sort(

      (a, b) =>

      new Date(b.created_at) -
      new Date(a.created_at)

    );



    res.json({

      success: true,
      total: activities.length,
      data: activities

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



// ===============================
// ACTIVITY STATS
// ===============================

const getActivityStats = async (req, res) => {

  try {

    const patientCount =
      await db.query(
        "SELECT COUNT(*) FROM patients"
      );

    const mappingCount =
      await db.query(
        "SELECT COUNT(*) FROM mapping_results"
      );

    const diagnosisCount =
      await db.query(
        "SELECT COUNT(*) FROM diagnoses"
      );

    const userCount =
      await db.query(
        "SELECT COUNT(*) FROM users"
      );

    let unreadNotifications = 0;

    try {

      const notificationCount =
        await db.query(
          `
          SELECT COUNT(*)
          FROM notifications
          WHERE is_read = false
          `
        );

      unreadNotifications =
        Number(notificationCount.rows[0].count);

    }

    catch (err) {}



    res.json({

      success: true,

      stats: {

        patients:
          Number(patientCount.rows[0].count),

        mappings:
          Number(mappingCount.rows[0].count),

        diagnoses:
          Number(diagnosisCount.rows[0].count),

        users:
          Number(userCount.rows[0].count),

        unreadNotifications

      }

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

  getRecentActivity,
  getActivityStats

};