const db = require("../db");

// GET ALL NOTIFICATIONS
const getNotifications = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// MARK AS READ
const markNotificationRead = async (req, res) => {

  try {

    await db.query(
      `
      UPDATE notifications
      SET is_read = TRUE
      WHERE id = $1
      `,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Notification marked as read"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

module.exports = {
  getNotifications,
  markNotificationRead
};