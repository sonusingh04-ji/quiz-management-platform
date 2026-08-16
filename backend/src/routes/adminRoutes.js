const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Dashboard Statistics (Admin Only)
router.get(
    "/dashboard",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getDashboardStats
);


// Get All Users (Admin Only)
router.get(
    "/users",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getAllUsers
);
// Get Single User (Admin Only)
router.get(
    "/users/:id",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getUserById
);
// Delete User (Admin Only)
router.delete(
    "/users/:id",
    verifyToken,
    authorizeRoles("admin"),
    adminController.deleteUser
);
// Activate / Deactivate User (Admin Only)
router.put(
    "/users/:id/status",
    verifyToken,
    authorizeRoles("admin"),
    adminController.updateUserStatus
);
// Analytics - Quiz Attempts Over Time
router.get(
    "/analytics/attempts-over-time",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getAttemptsOverTime
);


// Analytics - Student Registrations
router.get(
    "/analytics/student-registrations",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getStudentRegistrations
);


// Analytics - Average Quiz Scores
router.get(
    "/analytics/average-scores",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getAverageScores
);
// Analytics - Popular Categories
router.get(
    "/analytics/popular-categories",
    verifyToken,
    authorizeRoles("admin"),
    adminController.getPopularCategories
);
module.exports = router;