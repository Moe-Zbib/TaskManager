const express = require("express");
const app = express();
const authRoutes = require("./Auth/authRoutes");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
