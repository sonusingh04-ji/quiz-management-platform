const pool = require("../config/db");

// =====================================================
// CREATE QUESTION
// =====================================================
const createQuestion = async (
    quizId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    marks,
    difficulty
) => {

    const query = `
        INSERT INTO questions
        (
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            explanation,
            marks,
            difficulty
        )
        VALUES
        (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10
        )
        RETURNING *;
    `;

    const values = [
        quizId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        marks,
        difficulty
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// =====================================================
// GET QUESTIONS BY QUIZ ID
// =====================================================
const getQuestionsByQuizId = async (quizId) => {

    const query = `
        SELECT
            id,
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            explanation,
            marks,
            difficulty
        FROM questions
        WHERE quiz_id = $1
        ORDER BY id;
    `;

    const result = await pool.query(query, [quizId]);

    return result.rows;
};


// =====================================================
// UPDATE QUESTION
// =====================================================
const updateQuestion = async (
    id,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    explanation,
    marks,
    difficulty
) => {

    const query = `
        UPDATE questions
        SET
            question = $1,
            option_a = $2,
            option_b = $3,
            option_c = $4,
            option_d = $5,
            correct_answer = $6,
            explanation = $7,
            marks = $8,
            difficulty = $9
        WHERE id = $10
        RETURNING *;
    `;

    const values = [
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        marks,
        difficulty,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// =====================================================
// DELETE QUESTION
// =====================================================
const deleteQuestion = async (id) => {

    try {

        const query = `
            DELETE FROM questions
            WHERE id = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];

    } catch (error) {

        // PostgreSQL foreign-key violation
        if (error.code === "23503") {

            throw new Error(
                "This question cannot be deleted because students have already attempted it."
            );
        }

        throw error;
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createQuestion,
    getQuestionsByQuizId,
    updateQuestion,
    deleteQuestion
};