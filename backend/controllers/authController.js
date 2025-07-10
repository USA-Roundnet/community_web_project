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
    if (error.message === "Invalid email or password") {
      res.status(401).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Failed to log in", details: error.message });
    }
  }
};

// Forgot password - request password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    
    // Don't expose whether the email exists for security reasons
    if (error.message === "User with this email does not exist") {
      // Return success anyway to prevent email enumeration
      return res.status(200).json({ message: "If your email exists in our system, a password reset link has been sent" });
    }
    
    res.status(500).json({ message: "Failed to process request", details: error.message });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }
    
    const result = await authService.resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    
    if (error.message === "Invalid or expired password reset token") {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: "Failed to reset password", details: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};
