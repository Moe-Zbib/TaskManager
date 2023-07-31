const { check } = require("express-validator");

const validateTask = [
  check("title").trim().notEmpty().withMessage("Title is required").escape(),
  check("description").trim().escape(),
  check("due_time").notEmpty().withMessage("Due time is required"),
  check("side_notes").trim().escape(),
];

module.exports = { validateTask };
