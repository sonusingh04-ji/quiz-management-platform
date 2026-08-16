const db = require("../config/db");

// Get Dashboard Statistics
const getDashboardStats = async () => {

    const query = `
        SELECT
            -- Total students
            (
                SELECT COUNT(*)
                FROM users
                WHERE role = 'student'
            ) AS total_students,

            -- Total quizzes
            (
                SELECT COUNT(*)
                FROM quizzes
            ) AS total_quizzes,

            -- Published quizzes
            (
                SELECT COUNT(*)
                FROM quizzes
                WHERE status = 'published'
            ) AS published_quizzes,

            -- Draft quizzes
            (
                SELECT COUNT(*)
                FROM quizzes
                WHERE status = 'draft'
            ) AS draft_quizzes,

            -- Total questions
            (
                SELECT COUNT(*)
                FROM questions
            ) AS total_questions,

            -- Total attempts
            (
                SELECT COUNT(*)
                FROM attempts
            ) AS total_attempts,

            -- Average score
            (
                SELECT COALESCE(
                               ROUND(AVG(percentage), 2),
                               0
                       )
                FROM results
            ) AS average_score,

            -- Passed attempts
            (
                SELECT COUNT(*)
                FROM results r
                         JOIN quizzes q
                              ON r.quiz_id = q.id
                WHERE r.percentage >= q.passing_score
            ) AS passed_attempts,

            -- Failed attempts
            (
                SELECT COUNT(*)
                FROM results r
                         JOIN quizzes q
                              ON r.quiz_id = q.id
                WHERE r.percentage < q.passing_score
            ) AS failed_attempts;
    `;

    const result = await db.query(query);

    return result.rows[0];
};


// Get All Users
const getAllUsers = async () => {

    const query = `
        SELECT
            id,
            full_name,
            email,
            role,
            is_active,
            created_at
        FROM users
        ORDER BY created_at DESC;
    `;

    const result = await db.query(query);

    return result.rows;
};
// Update User Active Status
const updateUserStatus = async (userId, isActive) => {

    const query = `
        UPDATE users
        SET is_active = $1
        WHERE id = $2
        RETURNING id, full_name, email, role, is_active, created_at;
    `;

    const result = await db.query(query, [
        isActive,
        userId
    ]);

    return result.rows[0];
};
// Get Single User
const getUserById = async (userId) => {

    const query = `
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

    const result = await db.query(query, [userId]);

    return result.rows[0];
};


// Delete User
const deleteUser = async (userId) => {

    const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING id, full_name, email, role;
    `;

    const result = await db.query(query, [userId]);

    return result.rows[0];
};
// =====================================================
// Get Quiz Attempts Over Time
// =====================================================
const getAttemptsOverTime = async () => {

    const query = `
        SELECT
            DATE(started_at) AS date,
            COUNT(*) AS attempts
        FROM attempts
        WHERE started_at IS NOT NULL
        GROUP BY DATE(started_at)
        ORDER BY DATE(started_at);
    `;

    const result = await db.query(query);

    return result.rows;
};


// =====================================================
// Get Student Registrations Over Time
// =====================================================
const getStudentRegistrations = async () => {

    const query = `
        SELECT
            DATE(created_at) AS date,
            COUNT(*) AS registrations
        FROM users
        WHERE role = 'student'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at);
    `;

    const result = await db.query(query);

    return result.rows;
};


// =====================================================
// Get Average Quiz Scores
// =====================================================
const getAverageScores = async () => {

    const query = `
        SELECT
            q.id AS quiz_id,
            q.title AS quiz_title,
            COALESCE(
                ROUND(AVG(r.percentage), 2),
                0
            ) AS average_score
        FROM quizzes q
        LEFT JOIN results r
            ON r.quiz_id = q.id
        GROUP BY
            q.id,
            q.title
        ORDER BY
            q.id;
    `;

    const result = await db.query(query);

    return result.rows;
};
// =====================================================
// Get Popular Categories
// =====================================================
const getPopularCategories = async () => {

    const query = `
        SELECT
            q.category,
            COUNT(a.id) AS attempts
        FROM quizzes q
        LEFT JOIN attempts a
            ON a.quiz_id = q.id
        WHERE q.category IS NOT NULL
          AND q.category <> ''
        GROUP BY q.category
        ORDER BY attempts DESC;
    `;

    const result = await db.query(query);

    return result.rows;
};
module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getUserById,
    deleteUser,
    getStudentRegistrations,
    getAverageScores,
    getPopularCategories,
    getAttemptsOverTime
};