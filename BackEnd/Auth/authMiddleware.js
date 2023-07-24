const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authenticateUser = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token:", token);

  // Check if the token is missing or invalid
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token using the JWT_SECRET from .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    // Set the authenticated user ID in the request object
    req.userId = decoded.userId;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  authenticateUser,
};
