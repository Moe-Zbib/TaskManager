const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
const secretKey = require("../Key/JWT");
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("New User Created:");
    console.log("Username:", newUser.username);
    console.log("Email:", newUser.email);

    const token = jwt.sign({ userId: newUser.user_id }, secretKey, {
      expiresIn: "1h",
    });
    console.log("Session Token:", token);

    // Create a session token after successful login
    req.session.userId = newUser.user_id;

    // Retrieve and return user tasks if needed
    try {
      const userTasks = await User.getTasksByUserId(newUser.user_id);
      res.status(201).json({
        message: "User registered successfully",
        token,
        tasks: userTasks,
      });
    } catch (error) {
      console.error("Error retrieving user tasks:", error);
      res.status(500).json({
        message: "An error occurred while registering the user",
        errorType: error.name,
      });
    }
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({
      message: "An error occurred while saving the user",
      errorType: error.name,
    });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password comparison failed. Passwords don't match.");
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    console.log("Password comparison succeeded. User Logged In:");
    console.log("Username:", user.username);
    console.log("Email:", user.email);

    // Generate a JWT with user ID and a secret key
    const token = jwt.sign({ userId: user.user_id }, secretKey, {
      expiresIn: "1h",
    });
    console.log("Session Token:", token);

    // Create a session token after successful login
    req.session.userId = user.user_id;

    // Retrieve and return user tasks if needed
    try {
      const userTasks = await User.getTasksByUserId(user.user_id);
      res.json({ token, tasks: userTasks });
    } catch (error) {
      console.error("Error retrieving user tasks:", error);
      res.status(500).json({
        message: "An error occurred while logging in",
        errorType: error.name,
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "An error occurred while logging in",
      errorType: error.name,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out user:", err);
      res.status(500).json({
        message: "An error occurred while logging out",
        errorType: err.name,
      });
    } else {
      res.json({ message: "Logout successful" });
    }
  });
};
