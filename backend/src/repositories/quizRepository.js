const pool = require("../config/db");

// Create Quiz
const createQuiz = async (
    title,
    description,
    createdBy,
    category,
    difficulty,
    maxAttempts,
    passingScore,
    status = "draft",
    duration = 30
) => {

    const query = `
        INSERT INTO quizzes (
            title,
            description,
            created_by,
            category,
            difficulty,
            max_attempts,
            passing_score,
            status,
            duration
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
    `;

    const values = [
        title,
        description,
        createdBy,
        category,
        difficulty,
        maxAttempts ?? 1,
        passingScore ?? 60,
        status,
        duration ?? 30
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ==========================================
// Get All Quizzes
// ==========================================
const getAllQuizzes = async () => {
    const query = `
        SELECT *
        FROM quizzes
        ORDER BY id;
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ==========================================
// Get Quiz By ID
// ==========================================
const getQuizById = async (id) => {
    const query = `
        SELECT *
        FROM quizzes
        WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};


// ==========================================
// Update Quiz
// ==========================================
const updateQuiz = async (
    id,
    title,
    description,
    category,
    difficulty,
    maxAttempts,
    passingScore
) => {
    const query = `
        UPDATE quizzes
        SET
            title = $1,
            description = $2,
            category = $3,
            difficulty = $4,
            max_attempts = $5,
            passing_score = $6
        WHERE id = $7
        RETURNING *;
    `;

    const values = [
        title,
        description,
        category,
        difficulty,
        maxAttempts,
        passingScore,
        id
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ==========================================
// Delete Quiz
// ==========================================
const deleteQuiz = async (id) => {

    // ------------------------------------------
    // Check whether students attempted this quiz
    // ------------------------------------------
    const attemptCheck = await pool.query(
        `
        SELECT COUNT(*) AS count
        FROM attempts
        WHERE quiz_id = $1;
        `,
        [id]
    );

    const attemptCount = Number(
        attemptCheck.rows[0].count
    );


    // ------------------------------------------
    // Don't delete quiz if attempts exist
    // ------------------------------------------
    if (attemptCount > 0) {
        throw new Error(
            "This quiz cannot be deleted because students have already attempted it."
        );
    }


    // ------------------------------------------
    // Check whether quiz exists
    // ------------------------------------------
    const quizCheck = await pool.query(
        `
        SELECT id
        FROM quizzes
        WHERE id = $1;
        `,
        [id]
    );


    if (quizCheck.rows.length === 0) {
        return null;
    }


    // ------------------------------------------
    // Delete questions first
    // ------------------------------------------
    await pool.query(
        `
        DELETE FROM questions
        WHERE quiz_id = $1;
        `,
        [id]
    );


    // ------------------------------------------
    // Delete quiz
    // ------------------------------------------
    const result = await pool.query(
        `
        DELETE FROM quizzes
        WHERE id = $1
        RETURNING *;
        `,
        [id]
    );


    return result.rows[0];
};


// ==========================================
// Get Published Quizzes
// ==========================================
const getPublishedQuizzes = async () => {
    const query = `
        SELECT *
        FROM quizzes
        WHERE status = 'published'
        ORDER BY id;
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ==========================================
// Export Functions
// ==========================================
module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getPublishedQuizzes
};