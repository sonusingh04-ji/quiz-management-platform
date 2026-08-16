const db = require("../config/db");

const getLeaderboard = async () => {

    const result = await db.query(`
        SELECT
            users.id,
            users.full_name,
            COUNT(results.id) AS quizzes_attempted,
            MAX(results.percentage) AS highest_score,
            ROUND(AVG(results.percentage), 2) AS average_score
        FROM users
                 INNER JOIN results
                            ON users.id = results.user_id
        GROUP BY
            users.id,
            users.full_name
        ORDER BY
            highest_score DESC NULLS LAST,
            average_score DESC NULLS LAST;
    `);

    return result.rows;
};
const getQuizLeaderboard = async (quizId) => {

    const result = await db.query(
        `
        SELECT
            u.id,
            u.full_name,
            r.percentage AS score,
            r.correct_answers,
            r.wrong_answers,
            r.submitted_at
        FROM results r
        INNER JOIN users u
            ON u.id = r.user_id
        WHERE r.quiz_id = $1
        ORDER BY
            r.percentage DESC,
            r.submitted_at ASC
        `,
        [quizId]
    );

    return result.rows;
};
module.exports = {
    getLeaderboard,
    getQuizLeaderboard
};