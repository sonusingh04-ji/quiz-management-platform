const studentDashboardRepository =
    require("../repositories/studentDashboardRepository");

// =====================================================
// Get Student Dashboard
// =====================================================
const getStudentDashboard = async (userId) => {

    const stats =
        await studentDashboardRepository.getDashboardStats(
            userId
        );

    const recentAttempts =
        await studentDashboardRepository.getRecentAttempts(
            userId
        );

    const availableQuizzes =
        await studentDashboardRepository.getAvailableQuizCount();

    const rank =
        await studentDashboardRepository.getStudentRank(
            userId
        );


    return {

        statistics: {

            // Available published quizzes
            available_quizzes:
            availableQuizzes,

            // Completed attempts
            total_attempted:
                Number(
                    stats.total_attempted || 0
                ),

            // Passed quizzes
            passed:
                Number(
                    stats.passed || 0
                ),

            // Failed quizzes
            failed:
                Number(
                    stats.failed || 0
                ),

            // Average percentage
            average_score:
                Number(
                    stats.average_score || 0
                ),

            // Highest percentage
            highest_score:
                Number(
                    stats.highest_score || 0
                ),

            // Total questions answered
            total_questions_answered:
                Number(
                    stats.total_questions_answered || 0
                ),

            // Overall leaderboard rank
            rank
        },

        recent_attempts:
        recentAttempts
    };
};


// =====================================================
// Export
// =====================================================
module.exports = {
    getStudentDashboard
};