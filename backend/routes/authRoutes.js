const express = require("express");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware"); // Import verifyToken middleware
const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected route for testing
router.get("/protected-route", verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to this protected route!" });
});

module.exports = router;
