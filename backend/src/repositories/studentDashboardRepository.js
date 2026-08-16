const db = require("../config/db");

// =====================================================
// Get Student Dashboard Statistics
// =====================================================
const getDashboardStats = async (userId) => {

    const query = `
        SELECT
            COUNT(*) AS total_attempted,

            COUNT(
                CASE
                    WHEN percentage >= 60 THEN 1
                END
            ) AS passed,

            COUNT(
                CASE
                    WHEN percentage < 60 THEN 1
                END
            ) AS failed,

            COALESCE(
                ROUND(AVG(percentage), 2),
                0
            ) AS average_score,

            COALESCE(
                MAX(percentage),
                0
            ) AS highest_score,

            COALESCE(
                SUM(total_questions),
                0
            ) AS total_questions_answered

        FROM results
        WHERE user_id = $1;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows[0];
};


// =====================================================
// Get Recent Attempts
// =====================================================
const getRecentAttempts = async (userId) => {

    const query = `
        SELECT
            q.id AS quiz_id,
            q.title AS quiz_title,
            r.percentage,
            r.submitted_at
        FROM results r
        INNER JOIN quizzes q
            ON q.id = r.quiz_id
        WHERE r.user_id = $1
        ORDER BY r.submitted_at DESC
        LIMIT 5;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
};
// =====================================================
// Get Student Performance History
// =====================================================
const getPerformanceHistory = async (userId) => {

    const query = `
        SELECT
            q.title AS quiz_title,
            r.percentage,
            r.submitted_at
        FROM results r
        INNER JOIN quizzes q
            ON q.id = r.quiz_id
        WHERE r.user_id = $1
        ORDER BY r.submitted_at ASC;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
};

// =====================================================
// Get Available Published Quizzes
// =====================================================
const getAvailableQuizCount = async () => {

    const query = `
        SELECT COUNT(*) AS total
        FROM quizzes
        WHERE status = 'published';
    `;

    const result = await db.query(query);

    return Number(result.rows[0].total || 0);
};
// =====================================================
// Get Student Rank
// Uses the same ranking logic as the main leaderboard
// =====================================================
const getStudentRank = async (userId) => {

    const query = `
        WITH leaderboard AS (
            SELECT
                users.id,
                MAX(results.percentage) AS highest_score,
                ROUND(AVG(results.percentage), 2) AS average_score
            FROM users
            INNER JOIN results
                ON users.id = results.user_id
            GROUP BY
                users.id
        )

        SELECT rank
        FROM (
            SELECT
                id,
                ROW_NUMBER() OVER (
                    ORDER BY
                        highest_score DESC NULLS LAST,
                        average_score DESC NULLS LAST
                ) AS rank
            FROM leaderboard
        ) ranked
        WHERE id = $1;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows[0]
        ? Number(result.rows[0].rank)
        : null;
};

// =====================================================
// Export
// =====================================================
module.exports = {
    getDashboardStats,
    getRecentAttempts,
    getPerformanceHistory,
    getAvailableQuizCount,
    getStudentRank
};