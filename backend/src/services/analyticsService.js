const analyticsRepository = require("../repositories/analyticsRepository");

// Get Quiz Analytics
const getAnalytics = async () => {

    const stats = await analyticsRepository.getAnalyticsStats();

    const topQuizzes =
        await analyticsRepository.getTopQuizzes();

    const leastAttemptedQuizzes =
        await analyticsRepository.getLeastAttemptedQuizzes();

    return {

        statistics: {

            total_quizzes: Number(stats.total_quizzes),

            total_attempts: Number(stats.total_attempts),

            average_score: Number(stats.average_score),

            pass_rate: Number(stats.pass_rate),

            passed_attempts: Number(stats.passed_attempts),

            failed_attempts: Number(stats.failed_attempts)

        },

        top_quizzes: topQuizzes.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            attempts: Number(quiz.attempts),
            average_score: Number(quiz.average_score)
        })),

        least_attempted_quizzes: leastAttemptedQuizzes.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            attempts: Number(quiz.attempts)
        }))

    };

};

module.exports = {
    getAnalytics
};