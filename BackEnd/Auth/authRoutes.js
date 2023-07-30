const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const authController = require("./authController");
const asyncHandler = require("express-async-handler");
const { authenticateUser } = require("./authMiddleware");
const limiter = require("./rateLimiter");

const validateRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .escape(),
  body("email").trim().isEmail().withMessage("Invalid email address").escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .escape(),
];

const validateLogin = [
  body("email").trim().isEmail().withMessage("Invalid email address").escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .escape(),
];

router.post(
  "/register",
  limiter,
  validateRegistration,
  asyncHandler(authController.registerUser)
);

router.post(
  "/login",
  limiter,
  validateLogin,
  asyncHandler(authController.loginUser)
);

router.post("/logout", authenticateUser, authController.logoutUser);

module.exports = router;
