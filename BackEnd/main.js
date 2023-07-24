const express = require("express");
const app = express();
const authRoutes = require("./Auth/authRoutes");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

//  generated secret key
process.env.JWT_SECRET = generateSecretKey();

const sessionMiddleware = require("./Auth/sessionMiddleware"); // session middleware

app.use(express.json());

// Use the session middleware
app.use(sessionMiddleware);
app.use("/api/auth", authRoutes);
app.get("/api/test", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT 1 as result");
    res.json({ message: "Connected to the database", result: rows[0].result });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ message: "Error connecting to the database" });
  }
});

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
