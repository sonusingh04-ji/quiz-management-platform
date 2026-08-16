const express = require("express");

const router = express.Router();

const quizDiscoveryController =
    require("../controllers/quizDiscoveryController");

// Get all quizzes
router.get(
    "/",
    quizDiscoveryController.getAllQuizzes
);

// Get quiz by category
router.get(
    "/category/:category",
    quizDiscoveryController.getQuizzesByCategory
);

// Get quiz by difficulty
router.get(
    "/difficulty/:difficulty",
    quizDiscoveryController.getQuizzesByDifficulty
);

// Search quizzes by title
router.get(
    "/search/:title",
    quizDiscoveryController.searchQuizzesByTitle
);

module.exports = router;