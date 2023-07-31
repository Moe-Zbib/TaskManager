// taskController.js
const { validationResult } = require("express-validator");
const Task = require("../Model/tasks");

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { title, description, due_time, side_notes } = req.body;
  const user_id = req.user.userId;

  try {
    const task = await Task.createTask(
      user_id,
      title,
      description,
      due_time,
      side_notes
    );
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "An error occurred while creating the task",
      errorType: error.name,
    });
  }
};

exports.getTasks = async (req, res) => {
  const user_id = req.user.userId; // Assuming you have the authenticated user's ID in req.user

  try {
    const tasks = await Task.getTasksByUserId(user_id);
    res.json(tasks);
  } catch (error) {
    console.error("Error retrieving user tasks:", error);
    res.status(500).json({
      message: "An error occurred while fetching user tasks",
      errorType: error.name,
    });
  }
};

exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;
  const user_id = req.user.userId; // Assuming you have the authenticated user's ID in req.user

  try {
    const task = await Task.getTaskById(taskId);

    if (!task || task.user_id !== user_id) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Error retrieving task by ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching the task",
      errorType: error.name,
    });
  }
};
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const user_id = req.user.userId; // Assuming you have the authenticated user's ID in req.user

  try {
    const task = await Task.getTaskById(taskId);

    if (!task || task.user_id !== user_id) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, done, due_time, side_notes } = req.body;

    // Validate and sanitize the 'done' field
    if (typeof done !== "boolean") {
      return res
        .status(400)
        .json({ message: "'done' field must be a boolean value" });
    }

    task.title = title;
    task.description = description;
    task.done = done;
    task.due_time = due_time;
    task.side_notes = side_notes;

    await task.updateTask();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "An error occurred while updating the task",
      errorType: error.name,
    });
  }
};

exports.toggleTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const user_id = req.user.userId; // Assuming you have the authenticated user's ID in req.user

  try {
    const task = await Task.getTaskById(taskId);

    if (!task || task.user_id !== user_id) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.done = !task.done;

    await task.updateTask();

    res.json({ message: "Task status toggled successfully", task });
  } catch (error) {
    console.error("Error toggling task status:", error);
    res.status(500).json({
      message: "An error occurred while toggling the task status",
      errorType: error.name,
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const user_id = req.user.userId; // Assuming you have the authenticated user's ID in req.user

  try {
    const task = await Task.getTaskById(taskId);

    if (!task || task.user_id !== user_id) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteTask();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "An error occurred while deleting the task",
      errorType: error.name,
    });
  }
};
