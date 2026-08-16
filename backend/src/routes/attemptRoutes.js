const express = require("express");
const router = express.Router();

const attemptController = require("../controllers/attemptController");
const { verifyToken } = require("../middleware/authMiddleware");

// Start Quiz
router.get(
    "/start/:quizId",
    verifyToken,
    attemptController.startQuiz
);

// Quiz History
router.get(
    "/history",
    verifyToken,
    attemptController.getQuizHistory
);

// Submit Quiz
router.post(
    "/submit",
    verifyToken,
    attemptController.submitQuiz
);

// Attempt Details
router.get(
    "/:attemptId",
    verifyToken,
    attemptController.getAttemptDetails
);

module.exports = router;