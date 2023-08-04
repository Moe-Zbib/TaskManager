const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("../db");
const secretKey = require("../Key/JWT");

const sessionMiddleware = session({
  store: new pgSession({
    pool,
    tableName: "session", // Name of the table to store session data
  }),
  secret: secretKey, // Use the secretKey variable as the secret for session encryption
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
  },
});

module.exports = sessionMiddleware;
