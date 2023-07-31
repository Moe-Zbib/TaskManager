// taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("./taskController");
const { authenticateUser } = require("../Auth/authMiddleware");
const { validateTask } = require("./taskMiddleware");

router.post("/add", authenticateUser, validateTask, taskController.createTask);

router.get("/get", authenticateUser, taskController.getTasks);

router.get("/get/:taskId", authenticateUser, taskController.getTaskById);

router.put(
  "/task/:taskId",
  authenticateUser,
  validateTask,
  taskController.updateTask
);

router.put(
  "/toggle-status/:taskId",
  authenticateUser,
  taskController.toggleTaskStatus
);

router.delete("/delete/:taskId", authenticateUser, taskController.deleteTask);

module.exports = router;
