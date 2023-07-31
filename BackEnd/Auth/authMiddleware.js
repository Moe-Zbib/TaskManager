const jwt = require("jsonwebtoken");
const secretKey = require("../Key/JWT");

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access denied. Missing token." });
  }

  try {
    const decodedToken = jwt.verify(token.split(" ")[1], secretKey);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { authenticateUser };
