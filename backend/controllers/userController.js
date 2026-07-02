const db = require("../db");
const bcrypt = require("bcryptjs");

// =====================================
// GET ALL USERS
// =====================================

const getUsers = async (req, res) => {

  try {

    const result = await db.query(`
      SELECT
        id,
        username,
        role
      FROM users
      ORDER BY id
    `);

    res.json({
      success: true,
      total: result.rows.length,
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

// =====================================
// GET USER BY ID
// =====================================

const getUserById = async (req, res) => {

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
      [req.params.id]
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

// =====================================
// CREATE USER
// =====================================

const createUser = async (req, res) => {

  try {

    const {
      username,
      password,
      role
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const exists = await db.query(
      `
      SELECT id
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `
      INSERT INTO users
      (
        username,
        password,
        role
      )
      VALUES
      ($1,$2,$3)
      RETURNING id, username, role
      `,
      [
        username,
        hash,
        role || "doctor"
      ]
    );

    res.json({
      success: true,
      message: "User created successfully",
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
// DELETE USER
// =====================================

const deleteUser = async (req, res) => {

  try {

    const result = await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted"
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
  getUsers,
  getUserById,
  createUser,
  deleteUser
};