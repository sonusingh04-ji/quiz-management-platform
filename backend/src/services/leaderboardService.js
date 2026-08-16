const leaderboardRepository = require("../repositories/leaderboardRepository");

// Overall Leaderboard
const getLeaderboard = async () => {

    const leaderboard =
        await leaderboardRepository.getLeaderboard();

    return leaderboard.map((student, index) => ({
        rank: index + 1,
        id: student.id,
        full_name: student.full_name,
        quizzes_attempted: Number(student.quizzes_attempted),
        highest_score: Number(student.highest_score || 0),
        average_score: Number(student.average_score || 0)
    }));
};

// Quiz Leaderboard
const getQuizLeaderboard = async (quizId) => {

    const leaderboard =
        await leaderboardRepository.getQuizLeaderboard(quizId);

    return leaderboard.map((student, index) => ({
        rank: index + 1,
        id: student.id,
        full_name: student.full_name,
        score: Number(student.score),
        correct_answers: student.correct_answers,
        wrong_answers: student.wrong_answers,
        submitted_at: student.submitted_at
    }));
};

module.exports = {
    getLeaderboard,
    getQuizLeaderboard
};