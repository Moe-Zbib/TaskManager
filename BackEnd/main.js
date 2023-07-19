const express = require("express");
const app = express();
const authRoutes = require("./Auth/authRoutes");

// Other app configuration and middleware

// Mount the authentication routes
app.use("/api/auth", authRoutes);

// Other routes and middleware

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
