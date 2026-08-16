const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Register User
router.post("/register", userController.register);

// Login User
router.post("/login", userController.login);

// Get Logged-in User Profile (Protected Route)
router.get(
    "/profile",
    verifyToken,
    userController.getProfile
);

module.exports = router;