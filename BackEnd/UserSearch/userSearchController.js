const { validationResult } = require("express-validator");
const User = require("../Model/user");
const Task = require("../Model/tasks");

exports.searchUsersByUsername = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username } = req.query;
  try {
    const users = await User.searchByUsername(username);

    // Exclude email and password from the response
    const userResponse = users.map(({ user_id, username }) => ({
      user_id,
      username,
    }));

    // Fetch public tasks for each user
    const usersWithPublicTasks = await Promise.all(
      userResponse.map(async (user) => {
        const tasks = await Task.getPublicTasksByUserId(user.user_id);
        return { ...user, tasks };
      })
    );

    res.json(usersWithPublicTasks);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Error searching for users" });
  }
};
