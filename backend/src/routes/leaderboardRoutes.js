const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderboardController");
const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

console.log("verifyToken =", verifyToken);
console.log("authorizeRoles =", authorizeRoles);

// Overall Leaderboard
router.get(
    "/",
    verifyToken,
    authorizeRoles("student", "admin"),
    leaderboardController.getLeaderboard
);

router.get(
    "/quiz/:quizId",
    verifyToken,
    authorizeRoles("student", "admin"),
    leaderboardController.getQuizLeaderboard
);
module.exports = router;