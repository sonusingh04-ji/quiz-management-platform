const db = require("../config/db");

// =====================================================
// Get Attempt Report
// Admin / Reporting
// =====================================================
const getAttemptReport = async () => {

    const query = `
        SELECT
            a.id AS attempt_id,
            a.user_id,
            u.full_name AS student_name,
            u.email AS student_email,

            a.quiz_id,
            qz.title AS quiz_title,

            a.total_questions,
            a.correct_answers,
            a.wrong_answers,
            a.unanswered,

            a.score,
            a.percentage,
            a.status,

            a.time_taken,
            a.started_at,
            a.submitted_at

        FROM attempts a

        INNER JOIN users u
            ON a.user_id = u.id

        INNER JOIN quizzes qz
            ON a.quiz_id = qz.id

        WHERE a.status <> 'IN_PROGRESS'

        ORDER BY a.submitted_at DESC;
    `;

    const result = await db.query(query);

    return result.rows;
};


// =====================================================
// Get User Report
// =====================================================
const getUserReport = async () => {

    const query = `
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role,

            COUNT(r.id) AS quizzes_attempted,

            COALESCE(
                ROUND(
                    AVG(r.percentage),
                    2
                ),
                0
            ) AS average_score

        FROM users u

        LEFT JOIN results r
            ON u.id = r.user_id

        GROUP BY
            u.id,
            u.full_name,
            u.email,
            u.role

        ORDER BY u.id;
    `;

    const result = await db.query(query);

    return result.rows;
};


// =====================================================
// Get Quiz Report
// =====================================================
const getQuizReport = async () => {

    const query = `
        SELECT
            q.id AS quiz_id,
            q.title,
            q.status,

            u.full_name AS created_by,

            (
                SELECT COUNT(*)
                FROM questions ques
                WHERE ques.quiz_id = q.id
            ) AS total_questions,

            (
                SELECT COUNT(*)
                FROM results r
                WHERE r.quiz_id = q.id
            ) AS total_attempts,

            COALESCE(
                    (
                        SELECT ROUND(
                                       AVG(r.percentage),
                                       2
                               )
                        FROM results r
                        WHERE r.quiz_id = q.id
                    ),
                    0
            ) AS average_score,

            COALESCE(
                    (
                        SELECT ROUND(
                                       (
                                           COUNT(
                                                   CASE
                                                       WHEN r.percentage >= 60
                                                           THEN 1
                                                       END
                                           )::DECIMAL
                            /
                            NULLIF(COUNT(r.id), 0)
                                           ) * 100,
                                       2
                               )
                        FROM results r
                        WHERE r.quiz_id = q.id
                    ),
                    0
            ) AS pass_rate

        FROM quizzes q

                 LEFT JOIN users u
                           ON q.created_by = u.id

        ORDER BY q.id;
    `;

    const result = await db.query(query);

    return result.rows;
};


// =====================================================
// Get Student Attempt Details
// This is used for the detailed report / PDF
// =====================================================
const getStudentAttemptDetails = async (
    attemptId,
    userId
) => {

    const query = `
        SELECT
            a.id AS attempt_id,

            u.full_name AS student_name,
            u.email AS student_email,

            qz.id AS quiz_id,
            qz.title AS quiz_title,

            a.total_questions,
            a.correct_answers,
            a.wrong_answers,
            a.unanswered,

            a.score,
            a.percentage,
            a.status,

            a.time_taken,
            a.started_at,
            a.submitted_at

        FROM attempts a

        INNER JOIN users u
            ON a.user_id = u.id

        INNER JOIN quizzes qz
            ON a.quiz_id = qz.id

        WHERE a.id = $1
          AND a.user_id = $2;
    `;

    const result = await db.query(
        query,
        [
            attemptId,
            userId
        ]
    );

    return result.rows[0];
};


// =====================================================
// Get Questions + Answers For Attempt
// =====================================================
const getAttemptQuestionReport = async (
    attemptId
) => {

    const query = `
        SELECT
            q.id AS question_id,

            q.question,

            q.option_a,
            q.option_b,
            q.option_c,
            q.option_d,

            q.correct_answer,
            q.explanation,

            a.selected_answer,
            a.is_correct

        FROM answers a

        INNER JOIN questions q
            ON q.id = a.question_id

        WHERE a.attempt_id = $1

        ORDER BY q.id;
    `;

    const result = await db.query(
        query,
        [attemptId]
    );

    return result.rows;
};


// =====================================================
// Export User Report
// =====================================================
const exportUserReport = async () => {

    return await getUserReport();

};


// =====================================================
// Export Quiz Report
// =====================================================
const exportQuizReport = async () => {

    return await getQuizReport();

};
// =====================================================
// Get User Performance / Quiz History
// Admin
// =====================================================
const getUserPerformance = async (userId) => {

    const userQuery = `
        SELECT
            id,
            full_name,
            email,
            role,
            is_active,
            created_at
        FROM users
        WHERE id = $1;
    `;

    const userResult = await db.query(
        userQuery,
        [userId]
    );

    if (!userResult.rows[0]) {
        return null;
    }

    const historyQuery = `
        SELECT
            a.id AS attempt_id,
            a.quiz_id,
            q.title AS quiz_title,

            a.total_questions,
            a.correct_answers,
            a.wrong_answers,
            a.unanswered,

            a.score,
            a.percentage,
            a.status,

            a.time_taken,
            a.started_at,
            a.submitted_at

        FROM attempts a

        INNER JOIN quizzes q
            ON a.quiz_id = q.id

        WHERE a.user_id = $1
          AND a.status IN ('PASSED', 'FAILED')

        ORDER BY a.submitted_at DESC;
    `;

    const historyResult = await db.query(
        historyQuery,
        [userId]
    );

    const history = historyResult.rows;

    const totalAttempts = history.length;

    const averageScore =
        totalAttempts > 0
            ? Number(
                (
                    history.reduce(
                        (sum, attempt) =>
                            sum + Number(attempt.percentage || 0),
                        0
                    ) / totalAttempts
                ).toFixed(2)
            )
            : 0;

    const passedAttempts = history.filter(
        attempt => attempt.status === "PASSED"
    ).length;

    const failedAttempts = history.filter(
        attempt => attempt.status === "FAILED"
    ).length;

    const highestScore =
        totalAttempts > 0
            ? Math.max(
                ...history.map(
                    attempt =>
                        Number(attempt.percentage || 0)
                )
            )
            : 0;

    return {
        user: userResult.rows[0],

        statistics: {
            totalAttempts,
            averageScore,
            highestScore,
            passedAttempts,
            failedAttempts
        },

        history
    };
};

// =====================================================
// Export
// =====================================================
module.exports = {

    getAttemptReport,

    getUserReport,

    getQuizReport,

    getStudentAttemptDetails,

    getAttemptQuestionReport,

    exportUserReport,

    exportQuizReport,
    getUserPerformance

};