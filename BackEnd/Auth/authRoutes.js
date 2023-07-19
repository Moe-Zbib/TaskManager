const express = require("express");
const router = express.Router();
const authController = require("./authController");

// POST /api/auth/register
router.post("/register", authController.registerUser);

// POST /api/auth/login
router.post("/login", authController.loginUser);

// POST /api/auth/logout
router.post("/logout", authController.logoutUser);

module.exports = router;
