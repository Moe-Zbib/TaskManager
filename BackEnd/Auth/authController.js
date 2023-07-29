const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const saltRounds = 12;
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Incoming registration request:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password entered by the user:", password);

    // ... Validation and error handling code ...

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user with the hashed password (and other fields) to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password in the "password" column
    });

    await newUser.save();

    console.log("New User Created:");
    console.log("Username:", newUser.username);
    console.log("Email:", newUser.email);

    // Generate a JWT token with user ID and a secret key
    const token = jwt.sign(
      { userId: newUser.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token will expire in 1 hour
      }
    );

    console.log("Session Token:", token);

    // Create a session token after successful registration
    req.session.userId = newUser.user_id;

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({
      message: "An error occurred while registering the user",
      errorType: error.name,
    });
  }
};

// No changes needed in the registerUser function.
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ... Validation and error handling code ...

    // Find the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      // If user is not found, return an error response
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    // Compare the user-entered password with the hashed password from the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // If passwords don't match, return an error response
      console.log("Password comparison failed. Passwords don't match.");
      return res
        .status(401)
        .json({ message: "Email or password are incorrect" });
    }

    // Passwords match, user is authenticated
    console.log("Password comparison succeeded. User Logged In:");
    console.log("Username:", user.username);
    console.log("Email:", user.email);

    // Generate a JWT with user ID and a secret key
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token will expire in 1 hour
    });

    console.log("Session Token:", token);

    // Create a session token after successful login
    req.session.userId = user.user_id;

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
