const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

let secretKeyGenerated = false;

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

const setJWTSecret = () => {
  if (!secretKeyGenerated) {
    process.env.JWT_SECRET = generateSecretKey();
    secretKeyGenerated = true;
  }
};

setJWTSecret();

module.exports = process.env.JWT_SECRET;
