const express = require("express");
const app = express();
const helmet = require("helmet"); // Import the helmet middleware
const authRoutes = require("./Auth/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const crypto = require("crypto");
const session = require("express-session"); // Import express-session
dotenv.config();

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Generate secret key and set it as the JWT_SECRET
process.env.JWT_SECRET = generateSecretKey();

// Use the session middleware with the required configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set "true" for HTTPS connections
      maxAge: 3600000, // 1 hour (time in milliseconds)
    },
  })
);

app.use(express.json());
app.use(helmet()); // Use the helmet middleware here
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api/auth", authRoutes);

// Route to handle user dashboard or another screen
app.get("/dashboard", (req, res) => {
  // Check if the user is logged in (session is active)
  if (req.session.userId) {
    // Render the dashboard or another screen for the logged-in user
    res.send("Dashboard or Another Screen");
  } else {
    // Redirect to the login page if the user is not logged in
    res.redirect("/login");
  }
});

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
