const authService = require("../services/authService");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in registerUser:", error.message); // Log the error
    res
      .status(500)
      .json({ message: "Failed to register user", details: error.message });
  }
};

// Log in a user
const loginUser = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      res.status(401).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to log in", details: error.message });
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
};
