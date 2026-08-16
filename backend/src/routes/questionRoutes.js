const express = require("express");

const router = express.Router();

const questionController =
    require("../controllers/questionController");

const {
    verifyToken
} = require("../middleware/authMiddleware");

const {
    authorizeRoles
} = require("../middleware/roleMiddleware");


// =====================================================
// GET QUESTIONS
// =====================================================
// Students need to retrieve questions when taking quiz.
// Correct answer is NOT returned by repository.
router.get(
    "/:quizId/questions",
    questionController.getQuestionsByQuiz
);


// =====================================================
// CREATE QUESTION - ADMIN ONLY
// =====================================================
router.post(
    "/:quizId/questions",
    verifyToken,
    authorizeRoles("admin"),
    questionController.createQuestion
);


// =====================================================
// UPDATE QUESTION - ADMIN ONLY
// =====================================================
router.put(
    "/:quizId/questions/:id",
    verifyToken,
    authorizeRoles("admin"),
    questionController.updateQuestion
);


// =====================================================
// DELETE QUESTION - ADMIN ONLY
// =====================================================
router.delete(
    "/:quizId/questions/:id",
    verifyToken,
    authorizeRoles("admin"),
    questionController.deleteQuestion
);


module.exports = router;