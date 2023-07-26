const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { username, email, password } = req.body;

    console.log("Incoming registration request:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    console.log("New User Created:");
    console.log("Username:", newUser.username);
    console.log("Email:", newUser.email);
    console.log("Password (hashed):", newUser.password);

    // Create a session token after successful registration
    req.session.userId = newUser.id;

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({
      message: "An error occurred while registering the user",
      errorType: error.name,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Incoming login request:");
    console.log("Email:", email);
    console.log("Password:", password);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      // If user is not found, return an error response
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, return an error response
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    // Generate a JWT token with user ID and a secret key
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token will expire in 1 hour
    });

    console.log("Session Token:", token);

    console.log("User Logged In:");
    console.log("Username:", user.username);
    console.log("Email:", user.email);

    // Return the token in the response upon successful login
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "An error occurred while logging in",
      errorType: error.name,
    });
  }
};

exports.logoutUser = (req, res) => {
  res.json({ message: "Logout successful" });
};
