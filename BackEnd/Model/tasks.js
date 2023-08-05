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
    is_public,
  }) {
    this.task_id = task_id;
    this.user_id = user_id;
    this.title = title;
    this.description = description;
    this.done = done;
    this.due_time = due_time;
    this.created_at = created_at;
    this.side_notes = side_notes;
    this.is_public = is_public; // New field for public tasks
  }
  static sortByDueTimeAscending(tasks) {
    return tasks.sort((a, b) => new Date(a.due_time) - new Date(b.due_time));
  }
  static sortByDueTimeDescending(tasks) {
    return tasks.sort((a, b) => new Date(b.due_time) - new Date(a.due_time));
  }
  static sortByCreationTimeAscending(tasks) {
    return tasks.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }
  static sortByCreationTimeDescending(tasks) {
    return tasks.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
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
  static async getTaskByTitleAndUserId(title, user_id) {
    try {
      const query = "SELECT * FROM tasks WHERE title = $1 AND user_id = $2";
      const values = [title, user_id];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      return new Task(rows[0]);
    } catch (error) {
      console.error("Error getting task by title and user ID:", error);
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
        this.is_public, // Ad
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

  static async getPublicTasksByUserId(user_id) {
    try {
      const query =
        "SELECT * FROM tasks WHERE user_id = $1 AND is_public = true";
      const values = [user_id];
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new Task(row));
    } catch (error) {
      console.error("Error getting public tasks for user:", error);
      throw error;
    }
  }
}
module.exports = Task;
