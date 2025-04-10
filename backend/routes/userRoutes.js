const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const asyncHandler = require("../utils/asyncHandler");
const validateUserInput = require("../middleware/userMiddleware");

// Protect all routes except user creation
router.get("/", verifyToken, asyncHandler(userController.getAllUsers));

router.get("/:id", verifyToken, asyncHandler(userController.getUserById));

router.post("/", validateUserInput, asyncHandler(userController.createUser)); // Public route

router.put("/:id", verifyToken, asyncHandler(userController.updateUser));

router.delete("/:id", verifyToken, asyncHandler(userController.deleteUser));

module.exports = router;
