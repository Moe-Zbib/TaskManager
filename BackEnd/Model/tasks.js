// taskModel.js
const pool = require("../db");

class Task {
  constructor({
    task_id,
    user_id,
    title,
    description,
    done,
    due_time,
    created_at,
    side_notes,
  }) {
    this.task_id = task_id;
    this.user_id = user_id;
    this.title = title;
    this.description = description;
    this.done = done;
    this.due_time = due_time;
    this.created_at = created_at;
    this.side_notes = side_notes;
  }

  static async createTask(user_id, title, description, due_time, side_notes) {
    try {
      const query =
        "INSERT INTO tasks (user_id, title, description, due_time, side_notes) VALUES ($1, $2, $3, $4, $5) RETURNING *";
      const values = [user_id, title, description, due_time, side_notes];
      const { rows } = await pool.query(query, values);

      return new Task(rows[0]);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  static async getTasksByUserId(user_id) {
    try {
      const query = "SELECT * FROM tasks WHERE user_id = $1";
      const values = [user_id];
      const { rows } = await pool.query(query, values);

      return rows.map((row) => new Task(row));
    } catch (error) {
      console.error("Error getting tasks for user:", error);
      throw error;
    }
  }

  static async getTaskById(task_id) {
    try {
      const query = "SELECT * FROM tasks WHERE task_id = $1";
      const values = [task_id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return null;
      }

      return new Task(rows[0]);
    } catch (error) {
      console.error("Error getting task by ID:", error);
      throw error;
    }
  }

  async updateTask() {
    try {
      const query =
        "UPDATE tasks SET title = $1, description = $2, done = $3, due_time = $4, side_notes = $5 WHERE task_id = $6";
      const values = [
        this.title,
        this.description,
        this.done,
        this.due_time,
        this.side_notes,
        this.task_id,
      ];
      await pool.query(query, values);
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask() {
    try {
      const query = "DELETE FROM tasks WHERE task_id = $1";
      const values = [this.task_id];
      await pool.query(query, values);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

module.exports = Task;
