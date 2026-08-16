const express = require("express");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");

const router = express.Router();

const {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuizStatus,
    getPublishedQuizzes
} = require("../controllers/quizController");


// ==========================================
// Get All Quizzes
// ==========================================
router.get(
    "/",
    getAllQuizzes
);
// ==========================================
// Get Published Quizzes
// ==========================================
router.get(
    "/published",
    getPublishedQuizzes
);

// ==========================================
// Get Quiz By ID
// ==========================================
router.get(
    "/:id",
    getQuizById
);


// ==========================================
// Create Quiz - Admin Only
// ==========================================
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    createQuiz
);


// ==========================================
// Update Quiz - Admin Only
// ==========================================
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    updateQuiz
);


// ==========================================
// Delete Quiz - Admin Only
// ==========================================
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    deleteQuiz
);


// ==========================================
// Publish / Unpublish Quiz - Admin Only
// ==========================================
router.patch(
    "/:id/publish",
    verifyToken,
    authorizeRoles("admin"),
    updateQuizStatus
);


module.exports = router;