const db = require("../config/db");

// =====================================================
// Save Result
// =====================================================

const saveResult = async (
    user_id,
    quiz_id,
    attempt_id,
    total_questions,
    correct_answers,
    wrong_answers,
    percentage
) => {

    const query = `
        INSERT INTO results
        (
            user_id,
            quiz_id,
            attempt_id,
            total_questions,
            correct_answers,
            wrong_answers,
            percentage
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *;
    `;

    const values = [
        user_id,
        quiz_id,
        attempt_id,
        total_questions,
        correct_answers,
        wrong_answers,
        percentage
    ];

    const result = await db.query(
        query,
        values
    );

    return result.rows[0];
};

// Get All Results
const getAllResults = async () => {

    const query = `
        SELECT
            r.id,
            r.attempt_id,
            u.full_name,
            u.email,
            q.title AS quiz_title,
            r.total_questions,
            r.correct_answers,
            r.wrong_answers,
            r.percentage,
            r.submitted_at
        FROM results r
                 JOIN users u
                      ON r.user_id = u.id
                 JOIN quizzes q
                      ON r.quiz_id = q.id
        ORDER BY r.submitted_at DESC;
    `;

    const result = await db.query(query);

    return result.rows;
};

// =====================================================
// Get Result By ID
// =====================================================

const getResultById = async (id) => {

    const query = `
        SELECT
            r.id,
            r.user_id,
            r.quiz_id,
            r.attempt_id,
            u.full_name,
            u.email,
            q.title AS quiz_title,
            r.total_questions,
            r.correct_answers,
            r.wrong_answers,
            r.percentage,
            r.submitted_at
        FROM results r
                 JOIN users u
                      ON r.user_id = u.id
                 JOIN quizzes q
                      ON r.quiz_id = q.id
        WHERE r.id = $1;
    `;

    const result = await db.query(
        query,
        [id]
    );

    return result.rows[0];
};
// Get Results By User
const getResultsByUser = async (userId) => {

    const query = `
        SELECT
            r.id,
            r.attempt_id,
            q.title AS quiz_title,
            r.total_questions,
            r.correct_answers,
            r.wrong_answers,
            r.percentage,
            r.submitted_at
        FROM results r
                 JOIN quizzes q
                      ON r.quiz_id = q.id
        WHERE r.user_id = $1
        ORDER BY r.submitted_at DESC;
    `;

    const result = await db.query(
        query,
        [userId]
    );

    return result.rows;
};

// Delete Result
const deleteResult = async (id) => {

    const query = `
        DELETE FROM results
        WHERE id = $1
        RETURNING *;
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

module.exports = {
    saveResult,
    getAllResults,
    getResultById,
    getResultsByUser,
    deleteResult
};