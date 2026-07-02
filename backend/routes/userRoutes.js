const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

  getUsers,
  getUserById,
  createUser,
  deleteUser

} = require("../controllers/userController");

// =====================================
// GET ALL USERS
// =====================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

// =====================================
// GET USER BY ID
// =====================================

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getUserById
);

// =====================================
// CREATE USER
// =====================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

// =====================================
// DELETE USER
// =====================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);

module.exports = router;