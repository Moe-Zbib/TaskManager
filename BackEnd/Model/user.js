const pool = require("../db");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 12;
const Task = require("./tasks");

class User {
  constructor({ user_id, username, email, password }) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.password = password;
  }
  static async searchByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username ILIKE $1";
      const values = [`%${username}%`];
      const { rows } = await pool.query(query, values);
      return rows.map((row) => new User(row));
    } catch (error) {
      console.error("Error searching for users:", error);
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
  static async findOne({ email }) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const values = [email];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return null;
      }
      const { user_id, username, password } = rows[0];
      console.log("Stored Hashed Password:", password);
      return new User({ user_id, username, email, password });
    } catch (error) {
      console.error("Error finding user:", error);
      throw error;
    }
  }
  async save() {
    try {
      const query =
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id";
      const values = [this.username, this.email, this.password]; // No need to hash the password here
      const { rows } = await pool.query(query, values);
      if (rows.length > 0) {
        this.user_id = rows[0].user_id;
      }
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }
  async comparePassword(candidatePassword) {
    console.log("Candidate Password:", candidatePassword);
    console.log("Stored Password:", this.password);
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password Comparison Result:", isMatch);
    return isMatch;
  }
}

module.exports = User;
