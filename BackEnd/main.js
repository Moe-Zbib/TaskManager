const express = require("express");
const app = express();
const helmet = require("helmet");
const authRoutes = require("./Auth/authRoutes");
const taskRoutes = require("./Tasks/taskRoutes");
const userSearchRoutes = require("./UserSearch/userSearchRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const session = require("express-session");
dotenv.config();
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

process.env.JWT_SECRET = generateSecretKey();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 3600000,
    },
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api/auth", authRoutes);
app.get("/dashboard", (req, res) => {
  if (req.session.userId) {
    res.send("Dashboard or Another Screen");
  } else {
    res.redirect("/login");
  }
});
app.use("/api/user", userSearchRoutes);
app.use("/api/task", taskRoutes);
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
