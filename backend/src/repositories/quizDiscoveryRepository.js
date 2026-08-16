const db = require("../config/db");

// ==========================================
// Get All Published Quizzes
// ==========================================
const getAllQuizzes = async () => {

    const result = await db.query(`
        SELECT
            id,
            title,
            description,
            category,
            difficulty,
            max_attempts,
            passing_score,
            duration,
            created_by,
            created_at
        FROM quizzes
        WHERE status = 'published'
        ORDER BY id DESC;
    `);

    return result.rows;
};

// ==========================================
// Get Published Quiz By ID
// ==========================================
const getQuizById = async (id) => {

    const result = await db.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            difficulty,
            max_attempts,
            passing_score,
            duration,
            created_by,
            created_at
        FROM quizzes
        WHERE id = $1
        AND status = 'published';
        `,
        [id]
    );

    return result.rows[0];
};

// ==========================================
// Get Published Quizzes By Category
// ==========================================
const getQuizzesByCategory = async (category) => {

    const result = await db.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            difficulty,
            max_attempts,
            passing_score,
            duration
        FROM quizzes
        WHERE category = $1
        AND status = 'published'
        ORDER BY id DESC;
        `,
        [category]
    );

    return result.rows;
};

// ==========================================
// Get Published Quizzes By Difficulty
// ==========================================
const getQuizzesByDifficulty = async (difficulty) => {

    const result = await db.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            difficulty,
            max_attempts,
            passing_score,
            duration
        FROM quizzes
        WHERE difficulty = $1
        AND status = 'published'
        ORDER BY id DESC;
        `,
        [difficulty]
    );

    return result.rows;
};

// ==========================================
// Search Published Quizzes By Title
// ==========================================
const searchQuizzesByTitle = async (title) => {

    const result = await db.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            difficulty,
            max_attempts,
            passing_score,
            duration
        FROM quizzes
        WHERE LOWER(title) LIKE LOWER($1)
        AND status = 'published'
        ORDER BY id DESC;
        `,
        [`%${title}%`]
    );

    return result.rows;
};

// ==========================================
// Export
// ==========================================
module.exports = {
    getAllQuizzes,
    getQuizById,
    getQuizzesByCategory,
    getQuizzesByDifficulty,
    searchQuizzesByTitle
};