const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authController = require("./authController");
const asyncHandler = require("express-async-handler");

const validateRegistration = [
  check("email").trim().isEmail().withMessage("Invalid email address"),
  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  check("email").trim().isEmail().withMessage("Invalid email address"),
  check("password").trim().notEmpty().withMessage("Password is required"),
];

router.post(
  "/register",
  validateRegistration,
  asyncHandler(authController.registerUser)
);

router.post("/login", validateLogin, asyncHandler(authController.loginUser));

router.post("/logout", authController.logoutUser);

module.exports = router;
