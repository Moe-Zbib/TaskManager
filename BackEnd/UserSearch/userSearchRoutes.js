const express = require("express");
const router = express.Router();
const { query } = require("express-validator");
const UserController = require("./userSearchController");
router.get(
  "/search",
  [
    query("username")
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be between 3 and 20 characters"),
  ],
  UserController.searchUsersByUsername
);
module.exports = router;
