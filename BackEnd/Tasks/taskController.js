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
    const existingTask = await Task.getTaskByTitleAndUserId(title, user_id);
    if (existingTask) {
      return res
        .status(400)
        .json({ message: "Task with the same title already exists" });
    }

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
  const showPublic = req.query.showPublic || false; // Query parameter to filter public tasks

  try {
    let tasks = showPublic
      ? await Task.getPublicTasksByUserId(user_id) // Get public tasks if showPublic is true
      : await Task.getTasksByUserId(user_id); // Otherwise, get all tasks for the user

    let sortOption = req.query.sort || "due_time"; // Default sort option is due_time
    let sortOrder = req.query.order || "asc"; // Default sort order is ascending

    switch (sortOption) {
      case "due_time":
        tasks =
          sortOrder === "asc"
            ? Task.sortByDueTimeAscending(tasks)
            : Task.sortByDueTimeDescending(tasks);
        break;
      case "created_at":
        tasks =
          sortOrder === "asc"
            ? Task.sortByCreationTimeAscending(tasks)
            : Task.sortByCreationTimeDescending(tasks);
        break;
      default:
        // If an invalid sort option is provided, default to sorting by due_time in ascending order
        tasks = Task.sortByDueTimeAscending(tasks);
    }

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
  const user_id = req.user.userId;

  try {
    const task = await Task.getTaskById(taskId);

    if (!task || task.user_id !== user_id) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, done, due_time, side_notes, is_public } =
      req.body;

    // Validate and sanitize the 'done' and 'is_public' fields
    const isValidBoolean = (value) => typeof value === "boolean";
    if (!isValidBoolean(done) || !isValidBoolean(is_public)) {
      return res.status(400).json({
        message: "'done' and 'is_public' fields must be boolean values",
      });
    }

    task.title = title;
    task.description = description;
    task.done = done;
    task.due_time = due_time;
    task.side_notes = side_notes;
    task.is_public = is_public;

    await task.updateTask();

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "An error occurred while updating the task",
      errorType: error.name,
      errorMessage: error.message,
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
