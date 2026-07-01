const db = require("../db");
const bcrypt = require("bcryptjs");

// ===============================
// GET PROFILE
// ===============================

const getProfile = async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        id,
        username,
        role
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

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

// ===============================
// UPDATE PROFILE
// ===============================

const updateProfile = async (req, res) => {

  try {

    const { username } = req.body;

    await db.query(
      `
      UPDATE users
      SET username = $1
      WHERE id = $2
      `,
      [
        username,
        req.user.id
      ]
    );

    res.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// ===============================
// CHANGE PASSWORD
// ===============================

const changePassword = async (req, res) => {

  try {

    const {
      oldPassword,
      newPassword
    } = req.body;

    const result = await db.query(
      `
      SELECT password
      FROM users
      WHERE id = $1
      `,
      [req.user.id]
    );

    const valid = await bcrypt.compare(
      oldPassword,
      result.rows[0].password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Old password incorrect"
      });
    }

    const hashed =
      await bcrypt.hash(
        newPassword,
        10
      );

    await db.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [
        hashed,
        req.user.id
      ]
    );

    res.json({
      success: true,
      message: "Password changed successfully"
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
  getProfile,
  updateProfile,
  changePassword
};