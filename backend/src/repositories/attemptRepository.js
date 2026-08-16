const db = require("../config/db");
const pool = require("../config/db");
// =====================================================
// Get Quiz By ID
// =====================================================
const getQuizById = async (quizId) => {

    const result = await db.query(
        `
            SELECT *
            FROM quizzes
            WHERE id = $1
        `,
        [quizId]
    );

    return result.rows[0];
};


// =====================================================
// Get Student Attempt Count
// =====================================================
const getAttemptCount = async (userId, quizId) => {

    const result = await db.query(
        `
            SELECT COUNT(*) AS attempt_count
            FROM results
            WHERE user_id = $1
              AND quiz_id = $2
        `,
        [userId, quizId]
    );

    return Number(result.rows[0].attempt_count);
};


// =====================================================
// Get Questions By Quiz ID
// =====================================================
const getQuestionsByQuizId = async (quizId) => {

    const result = await db.query(
        `
            SELECT
                id,
                quiz_id,
                question,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer,
                explanation
            FROM questions
            WHERE quiz_id = $1
            ORDER BY id
        `,
        [quizId]
    );

    return result.rows;
};


// =====================================================
// Save Result
// =====================================================
const saveResult = async (
    userId,
    quizId,
    attemptId,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    percentage
) => {

    const result = await db.query(
        `
            INSERT INTO results
            (
                user_id,
                quiz_id,
                attempt_id,
                total_questions,
                correct_answers,
                wrong_answers,
                percentage,
                submitted_at
            )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    NOW()
                )
                RETURNING *
        `,
        [
            userId,
            quizId,
            attemptId,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            percentage
        ]
    );

    return result.rows[0];
};


// =====================================================
// Create Attempt
// =====================================================
const createAttempt = async (userId, quizId) => {

    const result = await db.query(
        `
            INSERT INTO attempts
            (
                user_id,
                quiz_id,
                started_at,
                status
            )
            VALUES
                (
                    $1,
                    $2,
                    NOW(),
                    'IN_PROGRESS'
                )
                RETURNING *
        `,
        [userId, quizId]
    );

    return result.rows[0];
};


// =====================================================
// Get Active Attempt
// =====================================================
const getActiveAttempt = async (userId, quizId) => {

    const result = await db.query(
        `
            SELECT *
            FROM attempts
            WHERE user_id = $1
              AND quiz_id = $2
              AND status = 'IN_PROGRESS'
            ORDER BY id DESC
                LIMIT 1
        `,
        [userId, quizId]
    );

    return result.rows[0];
};


// =====================================================
// Submit Attempt
// =====================================================
const submitAttempt = async (
    attemptId,
    percentage,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unanswered,
    timeTaken,
    status
) => {

    const query = `
        UPDATE attempts
        SET
            status = $1,
            score = $2,
            percentage = $2,
            total_questions = $3,
            correct_answers = $4,
            wrong_answers = $5,
            unanswered = $6,
            time_taken = $7,
            submitted_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *;
    `;

    const values = [
        status,
        percentage,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        timeTaken,
        attemptId
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// =====================================================
// Get Student Quiz History
// =====================================================
const getQuizHistory = async (
    userId,
    page = 1,
    limit = 10
) => {

    const offset = (page - 1) * limit;

    const result = await db.query(
        `
            SELECT
                a.id,
                a.quiz_id,
                q.title AS quiz_title,
                a.score,
                a.percentage,
                a.total_questions,
                a.correct_answers,
                a.wrong_answers,
                a.unanswered,
                a.time_taken,
                a.status,
                a.started_at,
                a.submitted_at
            FROM attempts a
                     INNER JOIN quizzes q
                                ON a.quiz_id = q.id
            WHERE a.user_id = $1
              AND a.status IN ('PASSED', 'FAILED')
            ORDER BY a.submitted_at DESC
                LIMIT $2
            OFFSET $3
        `,
        [
            userId,
            limit,
            offset
        ]
    );

    const countResult = await db.query(
        `
            SELECT COUNT(*) AS total
            FROM attempts
            WHERE user_id = $1
              AND status IN ('PASSED', 'FAILED')
        `,
        [userId]
    );

    return {
        history: result.rows,
        total: Number(countResult.rows[0].total),
        page,
        limit
    };
};


// =====================================================
// Get Attempt By ID
// =====================================================
const getAttemptById = async (
    attemptId,
    userId
) => {

    const result = await db.query(
        `
            SELECT
                a.id,
                a.user_id,
                a.quiz_id,
                q.title AS quiz_title,
                a.status,
                a.score,
                a.percentage,
                a.total_questions,
                a.correct_answers,
                a.wrong_answers,
                a.unanswered,
                a.time_taken,
                a.started_at,
                a.submitted_at
            FROM attempts a
                     INNER JOIN quizzes q
                                ON q.id = a.quiz_id
            WHERE a.id = $1
              AND a.user_id = $2
        `,
        [
            attemptId,
            userId
        ]
    );

    return result.rows[0];
};


// =====================================================
// Save Student Answer
// =====================================================
const saveAnswer = async (
    attemptId,
    questionId,
    selectedAnswer,
    isCorrect
) => {

    const result = await db.query(
        `
            INSERT INTO answers
            (
                attempt_id,
                question_id,
                selected_answer,
                is_correct
            )
            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4
                )
                RETURNING *
        `,
        [
            attemptId,
            questionId,
            selectedAnswer,
            isCorrect
        ]
    );

    return result.rows[0];
};


// =====================================================
// Get Answers Of Attempt
// =====================================================
const getAttemptAnswers = async (attemptId) => {

    const result = await db.query(
        `
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
            ORDER BY q.id
        `,
        [attemptId]
    );

    return result.rows;
};


// =====================================================
// Export
// =====================================================
module.exports = {
    getQuizById,
    getAttemptCount,
    getQuestionsByQuizId,
    saveResult,
    createAttempt,
    getActiveAttempt,
    submitAttempt,
    getQuizHistory,
    getAttemptById,
    saveAnswer,
    getAttemptAnswers
};