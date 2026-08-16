const db = require("../config/db");
// Dashboard Statistics
const getAnalyticsStats = async () => {

    const result = await db.query(`
        SELECT
                (SELECT COUNT(*) FROM quizzes) AS total_quizzes,

                (SELECT COUNT(*) FROM attempts) AS total_attempts,

                (
                    SELECT ROUND(
                                   COALESCE(AVG(percentage), 0),
                                   2
                           )
                    FROM results
                ) AS average_score,

                (
                    SELECT ROUND(
                                   COUNT(
                                           CASE
                                               WHEN percentage >= 60 THEN 1
                                               END
                                   ) * 100.0 /
                                   NULLIF(COUNT(*), 0),
                                   2
                           )
                    FROM results
                ) AS pass_rate,

                (
                    SELECT COUNT(*)
                    FROM results r
                             JOIN quizzes q
                                  ON r.quiz_id = q.id
                    WHERE r.percentage >= q.passing_score
                ) AS passed_attempts,

                (
                    SELECT COUNT(*)
                    FROM results r
                             JOIN quizzes q
                                  ON r.quiz_id = q.id
                    WHERE r.percentage < q.passing_score
                ) AS failed_attempts
    `);

    return result.rows[0];
};

// Top 5 Quizzes
const getTopQuizzes = async () => {

    const result = await db.query(`
        SELECT
            q.id,
            q.title,
            COUNT(r.id) AS attempts,
            ROUND(COALESCE(AVG(r.percentage), 0), 2) AS average_score
        FROM quizzes q
        LEFT JOIN results r
            ON q.id = r.quiz_id
        GROUP BY q.id, q.title
        ORDER BY attempts DESC
        LIMIT 5
    `);

    return result.rows;
};

// Least Attempted Quizzes
const getLeastAttemptedQuizzes = async () => {

    const result = await db.query(`
        SELECT
            q.id,
            q.title,
            COUNT(r.id) AS attempts
        FROM quizzes q
        LEFT JOIN results r
            ON q.id = r.quiz_id
        GROUP BY q.id, q.title
        ORDER BY attempts ASC
        LIMIT 5
    `);

    return result.rows;
};

module.exports = {
    getAnalyticsStats,
    getTopQuizzes,
    getLeastAttemptedQuizzes
};