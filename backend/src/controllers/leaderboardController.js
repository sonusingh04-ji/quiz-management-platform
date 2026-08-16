const leaderboardService = require("../services/leaderboardService");

// Overall Leaderboard
const getLeaderboard = async (req, res) => {

    try {

        const leaderboard =
            await leaderboardService.getLeaderboard();

        res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            data: leaderboard
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Quiz Leaderboard
const getQuizLeaderboard = async (req, res) => {

    try {

        const { quizId } = req.params;

        const leaderboard =
            await leaderboardService.getQuizLeaderboard(
                quizId
            );

        res.status(200).json({
            success: true,
            message: "Quiz leaderboard fetched successfully",
            data: leaderboard
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getLeaderboard,
    getQuizLeaderboard
};